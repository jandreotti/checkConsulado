//! FUENTE ORIGINAL: https://devforth.io/blog/how-to-simply-workaround-ram-leaking-libraries-like-puppeteer-universal-way-to-fix-ram-leaks-once-and-forever/
// https://github.com/puppeteer/puppeteer/issues/5893

import { spawn } from 'child_process';
import path from 'path';
import { momento } from '../helpers/momento';
// const __dirnamee = path.resolve(); //C:\Users\computadora\Desktop\WSP\wsp-example
// console.log(__dirname); //C:\Users\computadora\Desktop\WSP\wsp-example\dist\workers

export let dolarBlueCompra = 0;
export let dolarBlueVenta = 0;
let lastCheck = 0;

export const runCheckDolar = async data => {
	console.log(`\n[${momento()}] runCheckDolar START`);
	const actualCheck = Date.now();

	//! VALIDACIONES

	// const estados = globalThis.estados;
	// if (!estados) {
	// 	console.error('Cliente de whastapp-web.js no esta listo');
	// 	return;
	// }
	// const estadoActual = globalThis.estados[estados.length - 1].estado;
	// if (estadoActual !== 'LISTO') {
	// 	console.error('Cliente de whastapp-web.js no esta listo');
	// 	return;
	// }

	//! VARIABLES PASADAS AL PROCESO
	const jsonData = JSON.stringify(data || {});
	const b64Data = Buffer.from(jsonData).toString('base64');
	let stdoutData = '';

	//! EJECUCION DEL PROCESO HIJO
	const retorno = await new Promise(resolve => {
		// console.log(path.resolve(__dirname, 'wCheckDolar.js'));
		const proc = spawn('node', [path.resolve(__dirname, 'wCheckDolar.js'), `--input-data${b64Data}`, '--tagprocess'], {
			shell: false,
		});

		proc.stdout.on('data', data => {
			stdoutData += data;
		});

		proc.stderr.on('data', data => {
			console.error(`wCheckDolar (:---> ${data}`);
		});

		proc.on('close', async code => {});

		proc.on('exit', function () {
			console.log("wCheckDolar -> 'exit'");
			proc.kill();
			resolve(JSON.parse(stdoutData || '{}'));
		});
	});

	// console.log({ retorno });

	//! PROCESAMIENTO DEL RESULTADO
	const { compra, venta } = retorno as any;

	// primer chequeo
	if (dolarBlueCompra === 0 && dolarBlueVenta === 0) {
		dolarBlueCompra = parseFloat(compra);
		dolarBlueVenta = parseFloat(venta);
		lastCheck = actualCheck;
		console.log(`[${momento()}] runCheckDolar -> Fin Primer Chequeo...`);
		return;
	}

	// validacion para que no procese una operacion lenta despues de una rapida
	if (lastCheck > actualCheck) {
		console.log(`[${momento()}] runCheckDolar -> Fin Chequeo por terminar tarde...`);
		return;
	} else {
		lastCheck = actualCheck;
	}

	if (!compra || !venta) {
		console.log(`[${momento()}] runCheckDolar -> Fin Chequeo por compra/venta nula...`, { compra, venta });
		return;
	}

	if (dolarBlueCompra != parseFloat(compra) || dolarBlueVenta != parseFloat(venta)) {
		console.log(`      ------> runCheckDolar -> Cambio el dolar -> AVISAR!`);

		const diferenciaCompra = parseFloat(compra) - dolarBlueCompra;
		const diferenciaVenta = parseFloat(venta) - dolarBlueVenta;

		dolarBlueCompra = parseFloat(compra);
		dolarBlueVenta = parseFloat(venta);

		//Enviar Mensaje

		const chatIds = ['5493515925801@c.us', '5493512298961@c.us', '5493516461960@c.us'];
		// const chatIds = ['5493515925801@c.us'];

		const text = `Cambio la cotizacion del dolar:

Compra: $${compra} (${diferenciaCompra > 0 ? '+' : ''}${diferenciaCompra})
Venta:     *$${venta} (${diferenciaVenta > 0 ? '+' : ''}${diferenciaVenta})*`;

		for (const chatId of chatIds) {
			// await globalThis.client.sendMessage(chatId, text);
		}
	}
};
