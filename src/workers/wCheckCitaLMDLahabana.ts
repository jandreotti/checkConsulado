//import puppeteer, { TimeoutError } from 'puppeteer';

// import   scrollPageToBottom  from 'puppeteer-autoscroll-down'

import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';
import { TimeoutError } from 'puppeteer';
puppeteer.use(StealthPlugin());
// import randomUseragent from 'random-useragent';

import { momento, momentoFormateado, wait } from '../helpers/momento';
// import { getNewPageWhenLoaded } from '../helpers/puppeteer-helper';
import fs from 'fs';
import { scrollPageToBottom } from 'puppeteer-autoscroll-down';
import axios from 'axios';

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

		//const res=await axios.get('https://api.proxyscrape.com/?request=getproxies&proxytype=socks5&timeout=10000&country=all&ssl=all&anonymity=all')
		//const res = await axios.get('https://sunny9577.github.io/proxy-scraper/generated/socks5_proxies.json');
		//const res = await axios.get('https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/socks5/data.json');
  const res = await axios.get('https://www.proxyscan.io/api/proxy?last_check=9800&country=fr,us,ru&uptime=50&ping=500&limit=10&type=socks5');

  const proxies = res.data;
		//console.error(JSON.stringify(proxies));
		const proxy = proxies[Math.floor(Math.random() * proxies.length)];
		console.error(proxy);
		const proxyArgs = '--proxy-server=socks5://' + proxy.Ip + ':' + proxy.Port;
	 

//const proxyArgs = '--proxy-server=html://178.33.3.163:8080';

  console.error(proxyArgs);

		const browser = await puppeteer.launch({
			// args: [
			// 	'--no-sandbox',
			// 	'--disable-setuid-sandbox',
			// 	// '--disable-background-timer-throttling',
			// 	// '--disable-backgrounding-occluded-windows',
			// 	// '--disable-renderer-backgrounding',
			//			 	 //'--proxy-server=socks5://127.0.0.1:9150',
			// ],

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

 "--ignore-certificate-errors",
       "--ignore-certificate-errors-spki-list",

				//https://github.com/sunny9577/proxy-scraper
				//'--proxy-server=socks5://212.83.143.97:38669',
				//'--proxy-server=socks5://212.83.143.97:38669',
				//'--proxy-server=socks5://115.127.10.154:1088',

				//proxy && proxy.host && proxy.port && '--proxy-server=socks5://' + proxy.host + ':' + proxy.port,
				// ...(proxy && proxy.ip && proxy.port && proxy.ip != '' && proxy.port != ''
				// 	? '--proxy-server=socks5://' + proxy.ip + ':' + proxy.port
				// 	: []),

				proxyArgs,
			],
			headless: 'new', // trabaja en background ->  con este anda bien el waitforNetworkIdle
			// headless: false, //  VIEJO -> para ver que hace el explorador en la pagina
			// headless: true, //  para que no se vea lo que hace el explorador en la pagina
			// slowMo: 200, // Camara lenta para ver que hace el explorador
			ignoreHTTPSErrors: true,
			// devtools: true,
		});

		console.error(2);
		//! OPERAR EN LA PAGINA
		// Abrir una nueva pagina
//const context = await browser.createIncognitoBrowserContext({proxyServer:"socks5://"+ proxy.ip + ':' + proxy.port});
		//const context = await browser.createIncognitoBrowserContext();
		//const page = await context.newPage();
		const page = await browser.newPage();

		await page.setViewport({
			width: 1080 + Math.floor(Math.random() * 100),
			height: 1024 + Math.floor(Math.random() * 100),
			deviceScaleFactor: 1,
			hasTouch: false,
			isLandscape: false,
			isMobile: false,
		});

		//await page.setCacheEnabled(false)

		const USER_AGENT =
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
		// const userAgent = randomUseragent.getRandom();
		// const UA = userAgent || USER_AGENT;
		// await page.setUserAgent(UA);
		await page.setUserAgent(USER_AGENT);

		// const ua =
		// 	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36';
		// await page.setUserAgent(ua);
		// await page.setExtraHTTPHeaders({
		// 	'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
		// });

		// await page.setExtraHTTPHeaders({
		// 	"Connection": "keep-alive",
		// 	 "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
		// 'Accept':"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
		// 	"Sec-Fetch-Site": "same-origin",
		// 	"Sec-Fetch-Mode": "cors",
		// 	"Sec-Fetch-Dest": "empty",
		// 	// "Accept": "application/json",
		// 	"Sec-Fetch-User": "1",
		// 	// "Sec-Fetch-Dest": "document",
		// 	// "referer" :`https://www.supremenewyork.com/mobile/`,
		// 	"Accept-Encoding": " gzip, deflate, br",
		// 	"Accept-Language": " en-GB,en-US;q=0.9,en;q=0.8",
		// 	// "Cookie": `${set_cookie}`,
		// 	"dnt": "1",
		// 	"sec-fetch-site" : "same-origin"
		// },
		// )

		await page.setJavaScriptEnabled(true);

		await page.evaluateOnNewDocument(() => {
			//pass webdriver check
			Object.defineProperty(navigator, 'webdriver', {
				get: () => false,
			});
		});

		await page.evaluateOnNewDocument(() => {
			//pass chrome check
			// @ts-ignore
			window.chrome = {
				runtime: {},
				// etc.
			};
		});

		await page.evaluateOnNewDocument(() => {
			//pass plugins check
			const originalQuery = window.navigator.permissions.query;
			return (window.navigator.permissions.query = parameters =>
				// @ts-ignore
				parameters.name === 'notifications'
					? Promise.resolve({ state: Notification.permission })
					: originalQuery(parameters));
		});

		await page.evaluateOnNewDocument(() => {
			// Overwrite the `plugins` property to use a custom getter.
			Object.defineProperty(navigator, 'plugins', {
				// This just needs to have `length > 0` for the current test,
				// but we could mock the plugins too if necessary.
				get: () => [1, 2, 3, 4, 5],
			});
		});

		await page.evaluateOnNewDocument(() => {
			// Overwrite the `plugins` property to use a custom getter.
			Object.defineProperty(navigator, 'languages', {
				get: () => ['en-US', 'en'],
			});
		});

		//https://api.ipify.org?format=json
		// await page.goto('https://api.ipify.org', { waitUntil: 'load', timeout: 50 * 1000});
		// console.error('a');
		//const ip = await page.evaluate(`async (() => document.body.textContent.trim())()`);
		// const ip = await page.evaluate(() => document.body.textContent.trim());
		// console.error('IP: ', ip);
		console.error('aa');
		await wait(1000);

		await page.goto(url, { waitUntil: 'load',
   timeout: 120 * 1000
  });
//await page.goto(url);

		// Esto de aqui lo pongo para que este activa la pagina y funcione lo de abajo (AL FINAL SE SOLUCIONO CON headless: 'new',)
		//FUENTE: https://github.com/puppeteer/puppeteer/issues/3339
		//const session = await page.target().createCDPSession();
		//await session.send('Page.enable');
		//await session.send('Page.setWebLifecycleState', { state: 'active' });
console.error("aaa");

//await page.waitForSelector('a[href='https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff']', {
			 //visible: true,
		//});
		console.error(3);
		// Hacer click en el boton
		const a = await page.$(
			"a[href='https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff']"
		);

		await Promise.all([a.click(), wait(5000), page.waitForNavigation({ waitUntil: 'load', timeout: 60 * 1000 })]);
		console.error(4);
		// Esperar a que se cargue la nueva pagina
		// const newPagePromise = await getNewPageWhenLoaded(browser);
		// const page2 = (await newPagePromise) as puppeteer.Page;
		// await page.waitForNavigation({ timeout: 40 * 1000 });
		//await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40 * 1000 });
		// await page.waitForNavigation({ timeout: 20 });
		// await wait(5000);
		console.error(5);

		//await session.send('Page.enable');
		//await session.send('Page.setWebLifecycleState', { state: 'active' });

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
		console.error(6);

		await page.screenshot({ path: `0fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
		const bodyHTML0 = await page.content();
		fs.writeFileSync(`0fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML0);

		console.error(6.1);

		/// Obtener el boton de continuar y presionarlo

		// await page.waitForSelector('', {
		// 	visible: true,

		// 	// waitUntil: "load",
		// 	// waitUntil: "networkidle0",
		// 	// waitUntil: "domcontentloaded",
		// 	// waitUntil: "networkidle2",
		// 	timeout: 10 * 1000,
		// });

		await wait(10000);

		await page.waitForSelector('#idCaptchaButton', {
			visible: true,
		});
		console.error(6.2);
		const bktContinue = await page.$('#idCaptchaButton');

		console.error(6.3);

		// await page.on('load', msg => {
		// 	console.error(`load: ${JSON.stringify(msg, null, 2)}`);
		// });

		// await page.on('pageerror', msg => {
		// 	console.error(`pageerror: ${JSON.stringify(msg, null, 2)}`);
		// });

		// await page.on('console', msg => {
		// 	console.error(`console: ${JSON.stringify(msg, null, 2)}`);
		// });
		// await page.on('response', msg => {
		// 	console.error(`response: ${JSON.stringify(msg, null, 2)}`);
		// });

		// await page.on('domcontentloaded', msg => {
		// 	console.error(`domcontentloaded: ${JSON.stringify(msg, null, 2)}`);
		// });

		// console.error(6.4);

		//
		await bktContinue.click({
			delay: 100,
		});

		let isLoadingAvailable = true; // Your condition-to-stop
		let times = 0;

		while (isLoadingAvailable) {
			times++;
			console.error('esperando que cargue...:' + times);
			console.error('url:' + page.url());

			try {
				// await page.screenshot({
				// 	path: `0.5fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`,
				// 	fullPage: true,
				// });
				// const bodyHTML1 = await page.content();
				// fs.writeFileSync(`0.5fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML1);

				console.error('E1');
				await scrollPageToBottom(page as any, { size: 250, delay: 500 });
				console.error('E2');
				await page.waitForNetworkIdle({
					timeout: 10 * 1000,
					idleTime: 3000,
				});
				console.error('E3');
				console.error('url FINAL:' + page.url());
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
				console.error('EE' + ex.message);
				if (times <= 10) continue;
			}
			isLoadingAvailable = false; // Update your condition-to-stop value
		}
		//

		// await Promise.all([
		// 	page.waitForNetworkIdle({
		// 		timeout: 100 * 1000,
		// 		idleTime: 3000,
		// 	}),
		// 	bktContinue.click(),
		// 	page.mouse.move(0, 0),
		// 	page.mouse.move(100, 100),
		// 	page.mouse.move(400, 400),

		// 	//page.waitForNavigation({ waitUntil: 'load', timeout: 40 * 1000 })
		// ]);

		console.error(7);

		await wait(4000);

		//obtener la parte de abajo y presionarla para continuar
		// const idBktDefaultServicesContainer = await page2.$('#idBktDefaultServicesContainer');
		// await idBktDefaultServicesContainer.click();

		// Esto de aqui lo pongo para que este activa la pagina y funcione lo de abajo (AL FINAL SE SOLUCIONO CON headless: 'new',)
		//FUENTE: https://github.com/puppeteer/puppeteer/issues/3339
		// const session = await page.target().createCDPSession();
		// await session.send('Page.enable');
		// await session.send('Page.setWebLifecycleState', { state: 'active' });
		// console.error(8);

		// try {
		// 	await page.waitForNetworkIdle({
		// 		timeout: 50 * 1000,
		// 		idleTime: 3000,
		// 	});
		// } catch (e) {
		// 	console.error('timeout waitForNetwork Iddle');
		// }
		// console.error(8.1);

		//await wait(60000);

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
