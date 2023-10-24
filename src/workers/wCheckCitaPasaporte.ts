import puppeteer, { Browser, Page, TimeoutError } from 'puppeteer';
import { momento, momentoFormateado, wait } from '../helpers/momento';
import { closeBrowser, getNewPageWhenLoaded } from '../helpers/puppeteer-helper';
import fs from "fs-extra";
import { exec } from 'child_process';

// WARNING: don't use console.log here for debug, use console.error instead. STDOUT is used to deliver output data -> console.error('Mensaje');
// find value of input process argument with --input-data

export interface IInputData_WCheckCitaPasaporte {
	port?: string;
}

export interface IOutputData_WCheckCitaPasaporte {
	idDivNotAvailableSlotsTextTop: boolean;
	idTimeListTable: boolean;
	nuevaURL: string;
	idDivSlotColumnContainer_1: boolean;
	valueIdDivBktDatetimeSelectedDate: string;
	error?: Object;
}

const run = async () => {
	//! CON ESTAS LINEAS OBTENGO EL VALOR DEL ARGUMENTO QUE LE PASO AL PROCESO HIJO SI ES QUE LO NECESITO
	const inpDataB64 = process.argv.find(a => a.startsWith('--input-data')).replace('--input-data', '');
	const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString()) as IInputData_WCheckCitaPasaporte;
	//
	const { port } = inputData;
	const proxy = `--proxy-server=http://127.0.0.1:${port}`;
	const separador = port === '8091' ? '==================>' : '';
	// const separador = '==================>';
	//

	//! DECLARO EL VALOR POR DEFECTO QUE VOY A DEVOLVER EN CASO DE ERROR
	let outputData: IOutputData_WCheckCitaPasaporte = {
		idDivNotAvailableSlotsTextTop: false,
		idTimeListTable: false,
		nuevaURL: '',
		idDivSlotColumnContainer_1: false,
		valueIdDivBktDatetimeSelectedDate: '',
	};

	let browser: Browser;
	try {
		//! INICIO EL NAVEGADOR EN LA URL SOLICITADA
		const url =
			'https://www.exteriores.gob.es/Consulados/cordoba/es/ServiciosConsulares/Paginas/index.aspx?scco=Argentina&scd=129&scca=Pasaportes+y+otros+documentos&scs=Pasaportes+-+Requisitos+y+procedimiento+para+obtenerlo';

		browser = await puppeteer.launch({
			// userDataDir: "/tmp/limpiar2",
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				port ? proxy : '',
			],
			// headless: 'new', // trabaja en background ->  con este anda bien el waitforNetworkIdle
			headless: true,
			// headless: false, // para ver que hace el explorador en la pagina
			// slowMo:200, // Camara lenta para ver que hace el explorador
		});

		//! OPERAR EN LA PAGINA
		// Abrir una nueva pagina
		const page: Page = await browser.newPage();
		await page.goto(url, { waitUntil: 'load' });

		// Hacer click en el boton
		const a = await page.$(
			"a[href='https://app.bookitit.com/es/hosteds/widgetdefault/2517d2c8d726687ab7f770d8c3c4a7c7f']"
		);
		await a.click();

		// Esperar a que se cargue la nueva pagina
		const newPagePromise = await getNewPageWhenLoaded(browser);
		const page2 = (await newPagePromise) as Page;
		await page2.waitForNavigation();
		// await page.waitForNavigation({ waitUntil: 'networkidle2' });
		// await page.waitForNavigation({ timeout: 20 });
		await wait(5000);


		//! Grabo a ver que hay
		await page2.screenshot({ path: `1fullpage-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
		const bodyHTML1 = await page2.content();
		fs.writeFileSync(`1fullpage-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);

		///obtener el boton de continuar y presionarlo
		const bktContinue = await page2.$('#bktContinue');
		await bktContinue.click();

		//obtener la parte de abajo y presionarla para continuar
		const idBktDefaultServicesContainer = await page2.$('#idBktDefaultServicesContainer');
		await idBktDefaultServicesContainer.click();

		// await wait(15000);
		// esperar a que cargue la pagina
		await page2.waitForNetworkIdle();

		// AQUI SE ANALIZA LA PAGINA
		// -> div que aparece cuando NO hay citas habilitadas => debe ser NULL
		const idDivNotAvailableSlotsTextTop = await page2.$('#idDivNotAvailableSlotsTextTop');

		// -> div que aparece cuando hay citas habilitadas => debe ser != null
		// este div tambien aparece (aunque aparece vacio, sin hijos) cuando la pagina da un error de -> SE HA PRODUCIDO UN ERROR AL CARGAR LOS DATOS
		const idTimeListTable = await page2.$('#idTimeListTable');

		// -> URL en la que se encuentra -> debe incluir #datetime al final
		const nuevaURL = page2.url();

		//
		// -> div que aparece cuando hay citas habilitadas => debe ser != null
		const idDivSlotColumnContainer_1 = await page2.$('#idDivSlotColumnContainer-1');

		// -> div que tiene un valor cuando hay citas habilitadas => debe ser != null -> Viernes 16 de Diciembre de 2022
		const idDivBktDatetimeSelectedDate = await page2.$('#idDivBktDatetimeSelectedDate');
		let valueIdDivBktDatetimeSelectedDate = await page2.evaluate(el => el.textContent, idDivBktDatetimeSelectedDate);

		// Hacer click aqui:
		// idDivBktDatetimeDatePickerText

		//! Grabo a ver que hay
		await page2.screenshot({ path: `2fullpage-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
		const bodyHTML2 = await page2.content();
		fs.writeFileSync(`2fullpage-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML2);

		//? GRABO CUANDO PASA ALGO EN LA PANTALLA 3 (PRIMERA VERSION)
		// if (!idDivNotAvailableSlotsTextTop && idTimeListTable && nuevaURL.includes('#datetime')) {
		// 	//* Saco fotos si hay turnos disponibles
		// 	await page2.screenshot({ path: `1fullpage-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });

		// 	//* Guardo el HTML de la pagina para Debuguear
		// 	// const bodyHTML1 = await page2.evaluate(() => document.documentElement.outerHTML);
		// 	// const bodyHTML2 = await page2.evaluate(() => document.querySelector('*').outerHTML);
		// 	const bodyHTML3 = await page2.content();
		// 	//
		// 	// fs.writeFileSync(`fullpage1-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);
		// 	// fs.writeFileSync(`fullpage2-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML2);
		// 	fs.writeFileSync(`1fullpage3-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML3);
		// }

		//? GRABO CUANDO PASA ALGO EN LA PANTALLA 3 (SEGUNDA VERSION)
		if (
			!idDivNotAvailableSlotsTextTop &&
			idTimeListTable &&
			nuevaURL.includes('#datetime') &&
			idDivSlotColumnContainer_1 &&
			valueIdDivBktDatetimeSelectedDate != ''
		) {
			//* Saco fotos si hay turnos disponibles
			await page2.screenshot({ path: `3fullpage-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });

			//* Guardo el HTML de la pagina para Debuguear
			// const bodyHTML1 = await page2.evaluate(() => document.documentElement.outerHTML);
			// const bodyHTML2 = await page2.evaluate(() => document.querySelector('*').outerHTML);
			const bodyHTML3 = await page2.content();
			//
			// fs.writeFileSync(`fullpage1-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);
			// fs.writeFileSync(`fullpage2-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML2);
			fs.writeFileSync(`3fullpage3-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML3);
		}

		await page.close();
		await page2.close();
		// await browser.close();

		//! GUARDO EN EL OBJETO outputData lo que quiero retornar
		outputData = {
			idDivNotAvailableSlotsTextTop: !!idDivNotAvailableSlotsTextTop,
			idTimeListTable: !!idTimeListTable,
			nuevaURL,

			idDivSlotColumnContainer_1: !!idDivSlotColumnContainer_1,
			valueIdDivBktDatetimeSelectedDate,
		};

		//! RETORNO EL OBJETO outputData por medio del console.log
		console.log(JSON.stringify(outputData)); // print out data to STDOUT -> outputData
	} catch (error) {

		//! SI HAY UN ERROR, retorno el objeto outputData con los valores originales y el error
		console.log(
			JSON.stringify({
				...outputData,
				error: {
					error: 'HUBO ERROR',
					message: error?.message,
					timeout: error instanceof TimeoutError,
					objeto: JSON.stringify(error),
				},
			})
		); // print out data to STDOUT
	} finally {
		// Cierro el browser y elimino la carpeta temporal
		const res = await closeBrowser(browser);
		console.error(`closeBrowser: ${res}`);
	}

	//Ejecucion de comando para reiniciar el docker que contiene el proxy (Con esto de abajo cambio la IP)
	try {
		console.error(separador, '____ Ejecucion ____');
		//const cmd = port ? `sudo docker container restart proxy-kav-${port}` : 'sudo docker container restart proxy-kav';
		const cmd =
			port === '8089' ? `sudo docker container restart proxy-kav` : 'sudo docker container restart proxy-kav2';
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.error(separador, `error EJECUCION:: ${error.message}`);
				return;
			}

			if (stderr) {
				console.error(separador, `stderr EJECUCION: ${stderr}`);
				return;
			}

			console.error(separador, `stdout EJECUCION:\n${stdout}`);
		});
	} catch (e) {
		console.error(separador, `error EJECUCION:: ${e.message}`);
	}

	console.error(separador, '____ FIN Ejecucion ____');

	//! Esto es clave para que salga, porque a veces no salia
	process.exit(1);
};

run();
