import puppeteer from 'puppeteer';
import { momento, momentoFormateado, wait } from '../helpers/momento';
import { getNewPageWhenLoaded } from '../helpers/puppeteer-helper';
import fs from 'fs';

// WARNING: don't use console.log here for debug, use console.error instead. STDOUT is used to deliver output data -> console.error('Mensaje');
// find value of input process argument with --input-data

export interface IInputData_WCheckCitaPasaporte {}

export interface IOutputData_WCheckCitaPasaporte {
	idDivNotAvailableSlotsTextTop: boolean;
	idTimeListTable: boolean;
	nuevaURL: string;
}

const run = async () => {
	//! CON ESTAS LINEAS OBTENGO EL VALOR DEL ARGUMENTO QUE LE PASO AL PROCESO HIJO SI ES QUE LO NECESITO
	// const inpDataB64 = process.argv.find(a => a.startsWith('--input-data')).replace('--input-data', '');
	// const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString()) as IInputData_WCheckDolar;
	let outputData: IOutputData_WCheckCitaPasaporte = {
		idDivNotAvailableSlotsTextTop: false,
		idTimeListTable: false,
		nuevaURL: '',
	};

	try {
		const url =
			'https://www.exteriores.gob.es/Consulados/cordoba/es/ServiciosConsulares/Paginas/index.aspx?scco=Argentina&scd=129&scca=Pasaportes+y+otros+documentos&scs=Pasaportes+-+Requisitos+y+procedimiento+para+obtenerlo';

		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			// headless: false,
		});

		const page = await browser.newPage();
		await page.goto(url, { waitUntil: 'load' });

		const a = await page.$(
			"a[href='https://app.bookitit.com/es/hosteds/widgetdefault/2517d2c8d726687ab7f770d8c3c4a7c7f']"
		);
		await a.click();

		const newPagePromise = await getNewPageWhenLoaded(browser);
		const page2 = (await newPagePromise) as puppeteer.Page;

		await page2.waitForNavigation();
		// await page.waitForNavigation({ waitUntil: 'networkidle2' });
		// await page.waitForNavigation({ timeout: 20 });

		await wait(5000);

		const bktContinue = await page2.$('#bktContinue');
		// console.log({ bktContinue });
		await bktContinue.click();

		const idBktDefaultServicesContainer = await page2.$('#idBktDefaultServicesContainer');
		// console.log({ idBktDefaultServicesContainer });
		// console.log('1');
		await idBktDefaultServicesContainer.click();
		// console.log('2');

		// await wait(15000);
		// console.log('start');
		await page2.waitForNetworkIdle();
		// console.log('end');

		const idDivNotAvailableSlotsTextTop = await page2.$('#idDivNotAvailableSlotsTextTop');
		const idTimeListTable = await page2.$('#idTimeListTable');

		// console.log('3');
		const nuevaURL = page2.url();

		if (!idDivNotAvailableSlotsTextTop && idTimeListTable && nuevaURL.includes('#datetime')) {
			//* Saco fotos si hay turnos disponibles
			await page2.screenshot({ path: `fullpage-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });

			//* Guardo el HTML de la pagina para Debuguear
			// const bodyHTML1 = await page2.evaluate(() => document.documentElement.outerHTML);
			// const bodyHTML2 = await page2.evaluate(() => document.querySelector('*').outerHTML);
			const bodyHTML3 = await page2.content();
			//
			// fs.writeFileSync(`fullpage1-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);
			// fs.writeFileSync(`fullpage2-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML2);
			fs.writeFileSync(`fullpage3-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML3);
		}

		await page.close();
		await page2.close();
		await browser.close();

		outputData = {
			idDivNotAvailableSlotsTextTop: !!idDivNotAvailableSlotsTextTop,
			idTimeListTable: !!idTimeListTable,
			nuevaURL,
		};

		console.log(JSON.stringify(outputData)); // print out data to STDOUT -> outputData
	} catch (error) {
		// console.error({ errorCheckDolarBlueCordoba: error });
		console.log(JSON.stringify(outputData)); // print out data to STDOUT
	}

	process.exit(1); // Esto es clave para que salga, porque a veces no salia
};

run();
