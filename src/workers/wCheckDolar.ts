import puppeteer, { Browser } from 'puppeteer';
import { momento } from '../helpers/momento';
// import { getChromeTmpDataDir } from '../helpers/puppeteer-helper';
import fs from "fs-extra";
import { closeBrowser } from '../helpers/puppeteer-helper';


// WARNING: don't use console.log here for debug, use console.error instead. STDOUT is used to deliver output data -> console.error('Mensaje');
// find value of input process argument with --input-data

export interface IInputData_WCheckDolar { }

export interface IOutputData_WCheckDolar {
	compra?: string;
	venta?: string;
}

const run = async () => {
	//! CON ESTAS LINEAS OBTENGO EL VALOR DEL ARGUMENTO QUE LE PASO AL PROCESO HIJO SI ES QUE LO NECESITO
	// const inpDataB64 = process.argv.find(a => a.startsWith('--input-data')).replace('--input-data', '');
	// const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString()) as IInputData_WCheckDolar;

	//! DECLARO EL VALOR POR DEFECTO QUE VOY A DEVOLVER EN CASO DE ERROR
	let outputData: IOutputData_WCheckDolar = {};

	let browser: Browser;
	try {
		//! INICIO EL NAVEGADOR EN LA URL SOLICITADA
		browser = await puppeteer.launch({
			// userDataDir: "/tmp/limpiar1/",
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			headless: 'new', // trabaja en background ->  con este anda bien el waitforNetworkIdle
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

		//! OPERAR EN LA PAGINA y OBTENER EL VALOR DE LA VENTA Y COMPRA
		const outputData = await page.evaluate(() => {
			const compra = document
				.querySelector('#BluePromedio')
				?.querySelectorAll('.colCompraVenta')[0]
				?.textContent.trim()
				.split('\n')[0]
				.replace('$', '')
				.replace('.', '')
				.replace(',', '.')
				.trim();

			const venta = document
				.querySelector('#BluePromedio')
				?.querySelectorAll('.colCompraVenta')[1]
				?.textContent.trim()
				.split('\n')[0]
				.replace('$', '')
				.replace('.', '')
				.replace(',', '.')
				.trim();

			return { compra, venta };
		});

		await page.close();
		// await browser.close();

		//! RETORNO EL OBJETO outputData por medio del console.log
		console.log(JSON.stringify(outputData)); // print out data to STDOUT -> outputData
	} catch (error) {
		//! SI HAY UN ERROR, retorno el objeto outputData con los valores originales
		// console.error({ errorCheckDolarBlueCordoba: error });
		console.log(JSON.stringify(outputData)); // print out data to STDOUT
	}
	finally {
		// Cierro el browser y elimino la carpeta temporal
		const res = await closeBrowser(browser);
		console.error(`closeBrowser: ${res}`);
	}





	//! Esto es clave para que salga, porque a veces no salia
	process.exit(1);
};

run();
