import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';
puppeteer.use(StealthPlugin());
import { momento, momentoFormateado, wait } from '../helpers/momento';
import fs from 'fs-extra';
import { Browser, TimeoutError } from 'puppeteer';

import { exec } from 'child_process';
import { closeBrowser } from '../helpers/puppeteer-helper';

// WARNING: don't use console.log here for debug, use console.error instead. STDOUT is used to deliver output data -> console.error('Mensaje');
// find value of input process argument with --input-data

export interface IInputData_WCheckCitaLMDLahabana {
	port: string;
}

export interface IOutputData_WCheckCitaLMDLahabana {
	idDivBktServicesContainer_textContext: string; //  se busca este div en la pagina y se ve si tiene el texto 'No hay horas disponibles.'
	ban: boolean; // indica si esta baneado o no
	ultimaURL: string; // ultima url a la que se llego

	error?: {
		error: string;
		message: string;
		timeout: boolean;
		proxyError: boolean;
		objeto: string;
	};

	verificar: boolean;
	otros?: Object;
}

const run = async () => {
	//! CON ESTAS LINEAS OBTENGO EL VALOR DEL ARGUMENTO QUE LE PASO AL PROCESO HIJO SI ES QUE LO NECESITO
	const inpDataB64 = process.argv.find(a => a.startsWith('--input-data')).replace('--input-data', '');
	const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString()) as IInputData_WCheckCitaLMDLahabana;
	//
	const { port } = inputData;
	const proxy = `--proxy-server=http://127.0.0.1:${port}`;
	const separador = port === '8091' ? '==================>' : '';
	//

	console.error(separador, `port:${port}`);
	console.error(separador, proxy);

	//! DECLARO EL VALOR POR DEFECTO QUE VOY A DEVOLVER EN CASO DE ERROR
	let outputData: IOutputData_WCheckCitaLMDLahabana = {
		// idDivNotAvailableSlotsTextTop: false,
		// idTimeListTable: false,
		// nuevaURL: '',
		// idDivSlotColumnContainer_1: false,
		// valueIdDivBktDatetimeSelectedDate: '',
		idDivBktServicesContainer_textContext: '',
		ban: false,
		ultimaURL: '',
		verificar: false,
		otros: {
			port,
		},
	};

	let browser: Browser;

	try {
		console.error(separador, 1);
		//! INICIO EL NAVEGADOR EN LA URL SOLICITADA
		const url = 'https://www.exteriores.gob.es/Consulados/lahabana/es/ServiciosConsulares/Paginas/cita4LMD.aspx';

		browser = await puppeteer.launch({
			// userDataDir: "/tmp/limpiar3/",
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',

				'--ignore-certificate-errors',
				'--ignore-certificate-errors-spki-list',
				port ? proxy : '',
			],
			headless: 'new', // trabaja en background ->  con este anda bien el waitforNetworkIdle
			// headless: false, //  VIEJO -> para ver que hace el explorador en la pagina
			// headless: true, //  para que no se vea lo que hace el explorador en la pagina
			// slowMo: 200, // Camara lenta para ver que hace el explorador
			ignoreHTTPSErrors: true,
		});

		console.error(separador, 2);

		//! OPERAR EN LA PAGINA
		// Abrir una nueva pagina
		const page = await browser.newPage();

		await page.setExtraHTTPHeaders({
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
			// 'upgrade-insecure-requests': '1', // Con esta opcion me da error
			accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
			'accept-encoding': 'gzip, deflate, br',
			'accept-language': 'en-US,en;q=0.9,en;q=0.8',
		});

		// Esta opcion es para cerrar algun dialog que aparezca en la pagina
		page.on('dialog', async dialog => {
			await wait(1000);
			console.error(separador + 'close');
			try {
				await dialog.accept();
				await dialog.dismiss();
			} catch (e) {
				console.error(separador + 'E?:' + e);
			}
		});

		// Obtengo la ip actual desde donde me estoy conectando para tener un control de la misma
		try {
			console.error(separador, 2.1);
			await page.goto('https://api.ipify.org');
			await page.waitForSelector('body>pre');
			const ip = await page.evaluate(() => document.body.textContent.trim());
			outputData.otros = { ...outputData.otros, ip: ip };
			console.error(separador, 'IP: ', ip);
			console.error(separador, 2.2);
		} catch (error) {
			console.error(separador, error.message);
			console.error(separador, 2.3);
		}

		console.error(separador, 3);
		//Inicio la primera pagina, espero 5-12 segundos y muevo el mouse
		await page.goto(url, { waitUntil: 'load', timeout: 40 * 1000 });
		console.error(separador, 4);
		await wait((Math.floor(Math.random() * 6) + 2) * 1000);
		await page.mouse.move(50, 50, { steps: 50 });
		await wait((Math.floor(Math.random() * 2) + 1) * 1000);
		await page.mouse.move(0, 0, { steps: 50 });
		console.error(separador, 5);

		// Espero que aparezca el enlace para presionar
		await page.waitForSelector(
			"a[href='https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff']",
			{
				visible: true,
			}
		);
		console.error(separador, 6);

		// Hacer click en el enlace, esperar y mover el mouse mientras
		const a = await page.$(
			"a[href='https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff']"
		);
		await Promise.all([
			a.click(),
			wait(5000),
			page.waitForNavigation({ waitUntil: 'load', timeout: 40 * 1000 })
		]);
		await wait((Math.floor(Math.random() * 6) + 2) * 1000);
		await page.mouse.move(50, 50, { steps: 50 });
		await wait((Math.floor(Math.random() * 2) + 1) * 1000);
		await page.mouse.move(0, 0, { steps: 50 });
		console.error(separador, 7);

		// Verifico BANEO
		const url2 = page.url();
		if (url2 == 'https://www.exteriores.gob.es/es/Paginas/index.aspx') {
			console.error(separador, '____ BANEADO ____');
			outputData.ban = true;
			outputData.ultimaURL = url2;
			//! RETORNO EL OBJETO outputData por medio del console.log
			console.log(JSON.stringify(outputData)); // print out data to STDOUT -> outputData


			// Cierro el browser y elimino la carpeta temporal
			const res = await closeBrowser(browser);
			console.error(`closeBrowser: ${res}`);

			process.exit(1);
		}
		console.error(separador, 8);



		// Grabo
		await page.screenshot({ path: `0fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
		const bodyHTML0 = await page.content();
		fs.writeFileSync(`0fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML0);

		// Espero que aparezca el boton de continuar
		await page.waitForSelector('#idCaptchaButton', {
			visible: true,
			timeout: 30 * 1000,
		});

		// Selecciono el boton de continuar
		const bktContinue = await page.$('#idCaptchaButton');
		console.error(separador, 9);
		console.error(separador, 'url1:' + page.url());
		// Hago click en el boton de continuar
		await bktContinue.click();
		console.error(separador, 10);
		console.error(separador, 'url2:' + page.url());
		await wait((Math.floor(Math.random() * 6) + 2) * 1000);
		await page.mouse.move(50, 50, { steps: 50 });
		await wait((Math.floor(Math.random() * 2) + 1) * 1000);
		await page.mouse.move(0, 0, { steps: 50 });
		console.error(separador, 11);
		console.error(separador, 'url3:' + page.url());


		// Espero a que cargue la pagina (Esto es lo que mas error puede dar)
		await page.waitForNetworkIdle({
			timeout: 40 * 1000,
			idleTime: 3000,
		});
		console.error(separador, 12);
		await wait((Math.floor(Math.random() * 6) + 2) * 1000);
		await page.mouse.move(50, 50, { steps: 50 });
		await wait((Math.floor(Math.random() * 2) + 1) * 1000);
		await page.mouse.move(0, 0, { steps: 50 });
		console.error(separador, 13);
		console.error(separador, 'url FINAL:' + page.url()); //ACA DEBE DECIR SERVICES?

		//Grabo la pantalla siempre que inicio el proceso
		await page.screenshot({ path: `1fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
		const bodyHTML1 = await page.content();
		fs.writeFileSync(`1fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);
		console.error(separador, 'Analizando la pagina...');

		// Grabo la ultimaURL
		outputData = {
			...outputData,
			ultimaURL: page.url(),
		};

		//! ANALISIS DE LA PAGINA FINAL


		// -> Verifico si dice "No hay horas disponibles"
		let idDivBktServicesContainer_textContext;
		try {
			console.error(separador, 'Analizando la pagina...1');
			await page.waitForSelector('#idDivBktServicesContainer', { timeout: 40 * 1000 });
			console.error(separador, 'Analizando la pagina...2');

			//Intento leer el elemento que dice No hay horas disponibles
			idDivBktServicesContainer_textContext = await page.evaluate(() => {
				const el = document.getElementById('idDivBktServicesContainer');
				//const el3 = document.querySelector('#idDivBktServicesContainer');
				return Promise.resolve(el?.children[0]?.innerHTML?.split('<br>')[0]); //=== 'No hay horas disponibles.'; //No hay horas disponibles.
			});

			console.error(separador, idDivBktServicesContainer_textContext);
			console.error(separador, 'Analizando la pagina...3');
		} catch (e) {
			console.error(separador, JSON.stringify(e, null, 2));
			console.error(separador, "No se encontro el div 'idDivBktServicesContainer'");
		}

		console.error(separador, 'Analizando la pagina... 4');

		//A veces aca se clava con una pagina vacia, entonces evaluo si el body tiene algun objeto, si no tiene ningun objeto lanzo un timeout
		await page.evaluate(() => {
			const size = document.querySelector('body').children.length;
			if (size == 0) throw new TimeoutError("'Pagina no cargada???????????'");
		});

		console.error(separador, 'Fin analisis de la pagina 1');

		await wait(1000);

		// Hacer click aqui:
		// idDivBktDatetimeDatePickerText

		//? GRABO CUANDO PASA ALGO EN LA PANTALLA 3 (PRIMERA VERSION)
		//if (!idDivNotAvailableSlotsTextTop && idTimeListTable && nuevaURL.includes('#datetime')) {
		if (idDivBktServicesContainer_textContext != 'No hay horas disponibles.') {
			console.error(separador, 'PASO ALGO');
			await page.screenshot({ path: `2fullpage_PASOALGO-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
			const bodyHTML3 = await page.content();
			fs.writeFileSync(`2fullpage_PASOALGO-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML3);

			//hago click en el boton azul
			const bktContinue2 = await page.$('#bktContinue');
			await bktContinue2.click();
			await wait(2000);

			outputData = {
				...outputData,
				ultimaURL: page.url(),
			};

			//grabo
			await page.screenshot({
				path: `2fullpage_PASOALGO2-${momentoFormateado('YYYYMMDD_HHmmss')}.png`,
				fullPage: true,
			});
			const bodyHTML2 = await page.content();
			fs.writeFileSync(`2fullpage_PASOALGO2-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML2);
			console.error(separador, 'final 1');

			//obtener la parte de abajo y presionarla para continuar
			const idBktDefaultServicesContainer = await page.$('#idBktDefaultServicesContainer');
			await idBktDefaultServicesContainer.click();
			console.error(separador, 'final 2');

			// esperar a que cargue la pagina
			await page.waitForNetworkIdle();
			await wait(3000);
			console.error(separador, 'final 3');

			//Grabo
			await page.screenshot({
				path: `2fullpage_PASOALGO3-${momentoFormateado('YYYYMMDD_HHmmss')}.png`,
				fullPage: true,
			});
			const bodyHTML4 = await page.content();
			fs.writeFileSync(`2fullpage_PASOALGO3-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML4);

			outputData = {
				...outputData,
				verificar: true,
				ultimaURL: page.url(),
			};

			//! AQUI SE ANALIZA LA PAGINA FINAL
			// -> div que aparece cuando NO hay citas habilitadas => debe ser NULL
			const idDivNotAvailableSlotsTextTop = await page.$('#idDivNotAvailableSlotsTextTop');

			// -> div que aparece cuando hay citas habilitadas => debe ser != null
			// este div tambien aparece (aunque aparece vacio, sin hijos) cuando la pagina da un error de -> SE HA PRODUCIDO UN ERROR AL CARGAR LOS DATOS
			const idTimeListTable = await page.$('#idTimeListTable');

			// -> URL en la que se encuentra -> debe incluir #datetime al final
			const nuevaURL = page.url();

			//
			// -> div que aparece cuando hay citas habilitadas => debe ser != null
			const idDivSlotColumnContainer_1 = await page.$('#idDivSlotColumnContainer-1');

			// -> div que tiene un valor cuando hay citas habilitadas => debe ser != null -> Viernes 16 de Diciembre de 2022
			const idDivBktDatetimeSelectedDate = await page.$('#idDivBktDatetimeSelectedDate');
			let valueIdDivBktDatetimeSelectedDate = await page.evaluate(el => el.textContent, idDivBktDatetimeSelectedDate);

			//! GUARDO EN EL OBJETO outputData lo que quiero retornar
			const otros = {
				idDivNotAvailableSlotsTextTop: !!idDivNotAvailableSlotsTextTop,
				idTimeListTable: !!idTimeListTable,
				nuevaURL,

				idDivSlotColumnContainer_1: !!idDivSlotColumnContainer_1,
				valueIdDivBktDatetimeSelectedDate,
			};

			outputData = {
				...outputData,
				otros: { ...outputData.otros, ...otros },
			};
		}

		await wait(1000);

		//? GRABO CUANDO PASA ALGO EN LA PANTALLA 3 (SEGUNDA VERSION)
		// if (
		// 	!idDivNotAvailableSlotsTextTop &&
		// 	idTimeListTable &&
		// 	nuevaURL.includes('#datetime') &&
		// 	idDivSlotColumnContainer_1 &&
		// 	valueIdDivBktDatetimeSelectedDate != ''
		// ) {
		// 	//* Saco fotos si hay turnos disponibles
		// 	await page2.screenshot({ path: `2fullpage-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });

		// 	//* Guardo el HTML de la pagina para Debuguear
		// 	// const bodyHTML1 = await page2.evaluate(() => document.documentElement.outerHTML);
		// 	// const bodyHTML2 = await page2.evaluate(() => document.querySelector('*').outerHTML);
		// 	const bodyHTML3 = await page2.content();
		// 	//
		// 	// fs.writeFileSync(`fullpage1-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);
		// 	// fs.writeFileSync(`fullpage2-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML2);
		// 	fs.writeFileSync(`2fullpage3-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML3);
		// }

		await page.close();
		// await browser.close();

		//! GUARDO EN EL OBJETO outputData lo que quiero retornar
		outputData = {
			...outputData,
			idDivBktServicesContainer_textContext,

			// ultimaURL: url3,
			// idDivNotAvailableSlotsTextTop: !!idDivNotAvailableSlotsTextTop,
			// idTimeListTable: !!idTimeListTable,
			// nuevaURL,
			// idDivSlotColumnContainer_1: !!idDivSlotColumnContainer_1,
			// valueIdDivBktDatetimeSelectedDate,
		};

		console.error('____ Fin del proceso ____');

		//! RETORNO EL OBJETO outputData por medio del console.log
		console.log(JSON.stringify(outputData)); // print out data to STDOUT -> outputData
	} catch (error) {
		//! SI HAY UN ERROR, retorno el objeto outputData con los valores originales y el error
		console.log(
			JSON.stringify({
				...outputData,
				error: {
					error: `HUBO ERROR ${error.lala}`,
					message: error?.message,
					timeout: error instanceof TimeoutError,
					proxyError:
						error?.message?.includes('net::ERR_PROXY_CONNECTION_FAILED') ||
						error?.message?.includes('net::ERR_SOCKS_CONNECTION_FAILED') ||
						(error?.message?.includes('net::') && error?.message?.includes('PROXY')), //error instanceof ConnectionProxyError ProxyConnectionError,
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
