import { spawn } from 'child_process';
import path from 'path';

interface IEjecutar {
	data?: any;
	filename: string;
	tagProcess?: string;
	debug?: boolean;
}

export const ejecutar = ({ filename, data = {}, tagProcess = 'worker-sin-tag', debug = false }: IEjecutar) => {
	//! VARIABLES PASADAS AL PROCESO
	const jsonData = JSON.stringify(data);
	const b64Data = Buffer.from(jsonData).toString('base64');
	let stdoutData = '';

	//! EJECUTAR
	return new Promise(resolve => {
		// console.log(path.resolve(__dirname, 'wCheckDolar.js'));
		const proc = spawn('node', [path.resolve(__dirname, filename), `--input-data${b64Data}`, `--${tagProcess}`], {
			shell: false,
		});

		proc.stdout.on('data', data => {
			stdoutData += data;
		});

		proc.stderr.on('data', data => {
			if (debug) {
				const lineas = data.toString().split('\n');
				for (const linea of lineas) {
					if (linea.trim().length > 0) console.error(`${filename} (:---> ${linea}`);
				}
			}
			// if (debug) console.error(`${filename} (:---> ${data}`);
		});

		proc.on('close', async code => {});

		proc.on('exit', function () {
			if (debug) console.log(`${filename} -> 'exit'`);
			proc.kill();
			resolve(JSON.parse(stdoutData || '{}'));
		});
	});
};
