import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';

puppeteer.use(StealthPlugin());
// import randomUseragent from 'random-useragent';

import { momento, momentoFormateado, wait } from '../helpers/momento';
// import { getNewPageWhenLoaded } from '../helpers/puppeteer-helper';
import fs from 'fs';
import { TimeoutError } from 'puppeteer';

// WARNING: don't use console.log here for debug, use console.error instead. STDOUT is used to deliver output data -> console.error('Mensaje');
// find value of input process argument with --input-data

export interface IInputData_WCheckCitaLMDLahabana {}

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
	// const inpDataB64 = process.argv.find(a => a.startsWith('--input-data')).replace('--input-data', '');
	// const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString()) as IInputData_WCheckCitaLMDLahabana;

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
	};

	try {
		console.error(1);
		//! INICIO EL NAVEGADOR EN LA URL SOLICITADA
		const url = 'https://www.exteriores.gob.es/Consulados/lahabana/es/ServiciosConsulares/Paginas/cita4LMD.aspx';

		const browser = await puppeteer.launch({
			args: [
				// '--incognito',
				// '--disable-gpu',
				'--no-sandbox',
				// '--no-zygote',
				'--disable-setuid-sandbox',
				// '--disable-accelerated-2d-canvas',
				// '--disable-dev-shm-usage',
				// "--proxy-server='direct://'",
				// '--proxy-bypass-list=*',

				'--ignore-certificate-errors',
				'--ignore-certificate-errors-spki-list',

				//https://github.com/sunny9577/proxy-scraper
				//'--proxy-server=socks5://212.83.143.97:38669',

				//proxy && proxy.host && proxy.port && '--proxy-server=socks5://' + proxy.host + ':' + proxy.port,
				// ...(proxy && proxy.ip && proxy.port && proxy.ip != '' && proxy.port != ''
				// 	? '--proxy-server=socks5://' + proxy.ip + ':' + proxy.port
				// 	: []),

				// proxyArgs,
			],
			headless: 'new', // trabaja en background ->  con este anda bien el waitforNetworkIdle
			// headless: false, //  VIEJO -> para ver que hace el explorador en la pagina
			// headless: true, //  para que no se vea lo que hace el explorador en la pagina
			// slowMo: 200, // Camara lenta para ver que hace el explorador
			ignoreHTTPSErrors: true,
			// devtools: true,
			// ignoreDefaultArgs: ['--enable-automation'],
		});

		console.error(2);
		//! OPERAR EN LA PAGINA
		// Abrir una nueva pagina
		//const context = await browser.createIncognitoBrowserContext({proxyServer:"socks5://"+ proxy.ip + ':' + proxy.port});
		//const context = await browser.createIncognitoBrowserContext();
		//const page = await context.newPage();
		const page = await browser.newPage();

		await page.setExtraHTTPHeaders({
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
			// 'upgrade-insecure-requests': '1',
			accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
			'accept-encoding': 'gzip, deflate, br',
			'accept-language': 'en-US,en;q=0.9,en;q=0.8',
		});

		// Limit requests
		// await page.setRequestInterception(true);
		// page.on('response', async response => {
		// console.error(
		// 	'RESPONSE-> response.status():' +
		// 		response.status() +
		// 		' - response.url():' +
		// 		response.url() +
		// 		' - response.headers():' +
		// 		JSON.stringify(response.headers())
		// );

		// });

		// page.on('request', async request => {
		// console.error('REQUEST-> request.resourceType():' + request.resourceType() + ' - request.url():' + request.url());

		// console.error('request.resourceType():' + request.resourceType()
		// 	+ ' - request.url():' + request.url()
		// 	+ ' - request.method():' + request.method()
		// 	+ ' - request.headers():' + JSON.stringify(request.headers())
		// 	+ ' - request.postData():' + request.postData()
		// 	+ ' - request.isNavigationRequest():' + request.isNavigationRequest()
		// 	+ ' - request.frame():' + request.frame()
		// 	+ ' - request.frame().url():' + request.frame().url()
		// 	+ ' - request.frame().parentFrame():' + request.frame().parentFrame()
		// 	+ ' - request.frame().childFrames():' + request.frame().childFrames()
		// 	+ ' - request.frame().childFrames().length:' + request.frame().childFrames().length
		// );
		// if (request.resourceType() == 'image') {
		// 	await request.abort();
		// } else {
		// 	await request.continue();
		// }
		// });

		page.on('dialog', async dialog => {
			await wait(1000);
			console.error('close');
			try {
				await dialog.accept();
				await dialog.dismiss();
			} catch (e) {
				console.error('E?:' + e);
			}
		});

		console.error(3);
		//Inicio la primera pagina, espero 5-12 segundos y muevo el mouse
		await page.goto(url, { waitUntil: 'load', timeout: 40 * 1000 });
		console.error(3.1);
		await page.waitForTimeout((Math.floor(Math.random() * 12) + 5) * 1000);
		await page.mouse.move(50, 50, { steps: 50 });
		await page.waitForTimeout((Math.floor(Math.random() * 2) + 1) * 1000);
		await page.mouse.move(0, 0, { steps: 50 });

		console.error(4);
		await page.waitForSelector(
			"a[href='https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff']",
			{
				visible: true,
			}
		);

		console.error(5);
		// Hacer click en el boton
		const a = await page.$(
			"a[href='https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff']"
		);

		await Promise.all([a.click(), wait(5000), page.waitForNavigation({ waitUntil: 'load', timeout: 40 * 1000 })]);
		await page.waitForTimeout((Math.floor(Math.random() * 12) + 5) * 1000);
		await page.mouse.move(50, 50, { steps: 50 });
		await page.waitForTimeout((Math.floor(Math.random() * 2) + 1) * 1000);
		await page.mouse.move(0, 0, { steps: 50 });
		console.error(6);

		// Verifico BANEO
		const url2 = page.url();
		if (url2 == 'https://www.exteriores.gob.es/es/Paginas/index.aspx') {
			console.error('____ BANEADO ____');
			outputData.ban = true;
			outputData.ultimaURL = url2;
			//! RETORNO EL OBJETO outputData por medio del console.log
			console.log(JSON.stringify(outputData)); // print out data to STDOUT -> outputData
			process.exit(1);
		}
		console.error(7);

		const pressionar = async page => {
			await page.screenshot({ path: `0fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
			const bodyHTML0 = await page.content();
			fs.writeFileSync(`0fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML0);

			const bktContinue = await page.$('#idCaptchaButton');

			console.error('P1');

			//
			await bktContinue.click();
			await page.waitForTimeout((Math.floor(Math.random() * 12) + 5) * 1000);
			await page.mouse.move(50, 50, { steps: 50 });
			await page.waitForTimeout((Math.floor(Math.random() * 2) + 1) * 1000);
			await page.mouse.move(0, 0, { steps: 50 });
			console.error('P2');

			// await page.waitForNetworkIdle({
			// 	timeout: 100 * 1000,
			// 	idleTime: 15000,
			// });

			let isLoadingAvailable = true; // Your condition-to-stop
			let times = 0;

			while (isLoadingAvailable) {
				times++;
				console.error('esperando que cargue...:' + times);
				console.error('url:' + page.url());

				await page.mouse.move(50, 50, { steps: 50 });
				await page.waitForTimeout((Math.floor(Math.random() * 2) + 1) * 1000);
				await page.mouse.move(0, 0, { steps: 50 });

				try {
					// await page.screenshot({
					// 	path: `0.5fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`,
					// 	fullPage: true,
					// });
					// const bodyHTML1 = await page.content();
					// fs.writeFileSync(`0.5fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);

					console.error('P3');
					//await scrollPageToBottom(page as any, { size: 250, delay: 500 });
					// console.error('E2');
					await page.waitForNetworkIdle({
						timeout: 25 * 1000,
						idleTime: 10000,
					});
					console.error('P4');
					// console.error('url FINAL:' + page.url());
					// const aux = await page.waitForResponse(
					// 	response =>
					// 		response.url() ===
					// 		//'https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff/#services'
					// 		'https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff/#services'
					// 	//&& response.status() === 200
					// );
					// console.error('status:' + aux.status());
					// console.error('E4');
				} catch (ex) {
					console.error('EE:' + ex.message);
					if (
						page.url() ==
						'https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff/#services'
					) {
						// console.error();
						break;
					}
					if (times <= 6) continue;
				}
				isLoadingAvailable = false; // Update your condition-to-stop value
			}
			console.error('url FINAL:' + page.url());
		};

		// Obtener el boton de continuar y presionarlo
		let contadorPresiones = 0;
		try {
			while (true) {
				contadorPresiones++;
				console.error('presionando boton de continuar...:' + contadorPresiones);
				await page.waitForSelector('#idCaptchaButton', {
					visible: true,
					timeout: 30 * 1000,
				});
				await pressionar(page);
			}
		} catch (e) {
			console.error('Error al presionar el boton de continuar:' + contadorPresiones + ' ' + e.message);
		}
		console.error(9);

		await page.waitForTimeout((Math.floor(Math.random() * 12) + 5) * 1000);
		await page.mouse.move(50, 50, { steps: 50 });
		await page.waitForTimeout((Math.floor(Math.random() * 2) + 1) * 1000);
		await page.mouse.move(0, 0, { steps: 50 });

		console.error(10);

		//Grabo la pantalla siempre que inicio el proceso
		await page.screenshot({ path: `1fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
		const bodyHTML1 = await page.content();
		fs.writeFileSync(`1fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);

		console.error('Analizando la pagina...');
		// AQUI SE ANALIZA LA PAGINA
		// -> El div que dice que no hay disponibilidad
		//const idDivBktServicesContainer = await page.$('#idDivBktServicesContainer');
		//let idDivBktServicesContainer_textContext = await page.evaluate(el => el, idDivBktServicesContainer);

		// const element = await page.waitForSelector('#idDivBktServicesContainer'); // select the element
		// const value = await element.evaluate(el => el.innerHTML); // grab the textContent from the element, by evaluating this function in the browser context
		// //const value = await element.evaluate(el => el.children[0]); // grab the textContent from the element, by evaluating this function in the browser context
		// //value.innerHTML
		// //value.textContent
		// //value.childElementCount
		// //value.children[0].textContent
		// console.error(5.5);

		// console.error({
		// 	primer: 'primer',
		// 	uno: value.innerHTML,
		// 	dos: value.textContent,
		// 	tres: value.childElementCount,
		// 	// cuatro: value.children[0].textContent,
		// 	value,
		// });

		//const idDivBktServicesContainer_textContext = await page.evaluate(() => {

		// await wait(30000);
		// Grabo la ultimaURL
		outputData = {
			...outputData,
			ultimaURL: page.url(),
		};

		let idDivBktServicesContainer_textContext;

		try {
			console.error('Analizando la pagina...1');
			await page.waitForSelector('#idDivBktServicesContainer', { timeout: 40 * 1000 });
			console.error('Analizando la pagina...2');
			//Intento leer el elemento que dice No hay horas disponibles
			idDivBktServicesContainer_textContext = await page.evaluate(() => {
				const el = document.getElementById('idDivBktServicesContainer');
				//const el3 = document.querySelector('#idDivBktServicesContainer');
				return Promise.resolve(el?.children[0]?.innerHTML?.split('<br>')[0]); //=== 'No hay horas disponibles.'; //No hay horas disponibles.
			});
			console.error(idDivBktServicesContainer_textContext);
			console.error('Analizando la pagina...3');
		} catch (e) {
			console.error(JSON.stringify(e, null, 2));
			console.error("No se encontro el div 'idDivBktServicesContainer'");
			// await page.screenshot({ path: `1fullpage_ERROR1-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
			// const bodyHTML1 = await page.content();
			// fs.writeFileSync(`1fullpage_ERROR1-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);
		}

		// await page.screenshot({ path: `1fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
		// const bodyHTML1 = await page.content();
		// fs.writeFileSync(`1fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);

		console.error('analisis1');
		//A veces aca se clava con una pagina vacia, entonces evaluo si el body tiene algun objeto, si no tiene ningun objeto lanzo un timeout
		await page.evaluate(() => {
			const size = document.querySelector('body').children.length;

			if (size == 0) throw new TimeoutError("'Pagina no cargada???????????'");
		});

		//console.error('analisis2');

		// //Intento leer el elemento que dice No hay horas disponibles
		// const idDivBktServicesContainer_textContext = await page.evaluate(() => {
		// 	const el = document.getElementById('idDivBktServicesContainer');
		// 	//const el3 = document.querySelector('#idDivBktServicesContainer');
		// 	return el?.children[0]?.innerHTML?.split('<br>')[0]; //=== 'No hay horas disponibles.'; //No hay horas disponibles.
		// });

		console.error('Fin analisis de la pagina');
		// const bktContinue2 = await page.$('#bktContinue').catch(e => null);
		// console.error(bktContinue2);

		// console.error('paso');

		await wait(1000);

		// console.error('fin2');

		// // -> div que aparece cuando NO hay citas habilitadas => debe ser NULL
		// const idDivNotAvailableSlotsTextTop = await page2.$('#idDivNotAvailableSlotsTextTop');

		// // -> div que aparece cuando hay citas habilitadas => debe ser != null
		// // este div tambien aparece (aunque aparece vacio, sin hijos) cuando la pagina da un error de -> SE HA PRODUCIDO UN ERROR AL CARGAR LOS DATOS
		// const idTimeListTable = await page2.$('#idTimeListTable');

		// // -> URL en la que se encuentra -> debe incluir #datetime al final
		// const nuevaURL = page2.url();

		// //
		// // -> div que aparece cuando hay citas habilitadas => debe ser != null
		// const idDivSlotColumnContainer_1 = await page2.$('#idDivSlotColumnContainer-1');

		// // -> div que tiene un valor cuando hay citas habilitadas => debe ser != null -> Viernes 16 de Diciembre de 2022
		// const idDivBktDatetimeSelectedDate = await page2.$('#idDivBktDatetimeSelectedDate');
		// let valueIdDivBktDatetimeSelectedDate = await page2.evaluate(el => el.textContent, idDivBktDatetimeSelectedDate);

		// Hacer click aqui:
		// idDivBktDatetimeDatePickerText

		//? GRABO CUANDO PASA ALGO EN LA PANTALLA 3 (PRIMERA VERSION)
		//if (!idDivNotAvailableSlotsTextTop && idTimeListTable && nuevaURL.includes('#datetime')) {
		if (idDivBktServicesContainer_textContext != 'No hay horas disponibles.') {
			//* Saco fotos si hay turnos disponibles
			await page.screenshot({ path: `2fullpage_PASOALGO-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
			//* Guardo el HTML de la pagina para Debuguear
			// const bodyHTML1 = await page2.evaluate(() => document.documentElement.outerHTML);
			// const bodyHTML2 = await page2.evaluate(() => document.querySelector('*').outerHTML);
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

			console.error('final 1');
			//obtener la parte de abajo y presionarla para continuar
			const idBktDefaultServicesContainer = await page.$('#idBktDefaultServicesContainer');
			await idBktDefaultServicesContainer.click();
			console.error('final 2');

			// await wait(15000);
			// esperar a que cargue la pagina
			try {
				await page.waitForNetworkIdle();
			} catch (e) {
				console.error('error en waitForNetworkIdle2');
			}
			await wait(3000);

			console.error('final 3');

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

			// AQUI SE ANALIZA LA PAGINA
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
				otros,
			};
		}

		await wait(4000);

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
		// await page2.close();
		await browser.close();

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
						error?.message?.includes('net::ERR_SOCKS_CONNECTION_FAILED'), //error instanceof ConnectionProxyError ProxyConnectionError,
					objeto: JSON.stringify(error),
				},
			})
		); // print out data to STDOUT
	}

	//! Esto es clave para que salga, porque a veces no salia
	process.exit(1);
};

run();
