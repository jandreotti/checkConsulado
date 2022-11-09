import puppeteer from 'puppeteer';
import { momento } from '../helpers/momento';

// WARNING: don't use console.log here for debug, use console.error instead. STDOUT is used to deliver output data -> console.error('Mensaje');
// find value of input process argument with --input-data

export interface IInputData_WCheckDolar {}

export interface IOutputData_WCheckDolar {
	compra?: string;
	venta?: string;
}

const run = async () => {
	//! CON ESTAS LINEAS OBTENGO EL VALOR DEL ARGUMENTO QUE LE PASO AL PROCESO HIJO SI ES QUE LO NECESITO
	// const inpDataB64 = process.argv.find(a => a.startsWith('--input-data')).replace('--input-data', '');
	// const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString()) as IInputData_WCheckDolar;
	let outputData: IOutputData_WCheckDolar = {};

	try {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const page = await browser.newPage();

		// await page.goto('https://www.dolarhoy.com/cotizacion-dolar-blue-hoy-cordoba');
		await page.goto(
			'https://www.infodolar.com/cotizacion-dolar-provincia-cordoba.aspx'
			// {
			//  FUENTE: https://www.urlbox.io/puppeteer-wait-for-page-load
			// 	waitUntil: 'networkidle2',
			// }
		);

		const outputData = await page.evaluate(() => {
			const compra = document
				.querySelector('#BluePromedio')
				?.querySelectorAll('.colCompraVenta')[0]
				?.textContent.trim()
				.split('\n')[0]
				.replace('$', '')
				.replace(',', '.');

			const venta = document
				.querySelector('#BluePromedio')
				?.querySelectorAll('.colCompraVenta')[1]
				?.textContent.trim()
				.split('\n')[0]
				.replace('$', '')
				.replace(',', '.');

			return { compra, venta };
		});

		await page.close();
		await browser.close();

		console.log(JSON.stringify(outputData)); // print out data to STDOUT -> outputData
	} catch (error) {
		// console.error({ errorCheckDolarBlueCordoba: error });
		console.log(JSON.stringify(outputData)); // print out data to STDOUT
	}

	process.exit(1); // Esto es clave para que salga, porque a veces no salia
};

run();
