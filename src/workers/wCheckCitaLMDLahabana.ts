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
		const res = await axios.get(
			'https://www.proxyscan.io/api/proxy?last_check=9800&country=fr,us,ru&uptime=50&ping=500&limit=10&type=socks5'
		);

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

				'--ignore-certificate-errors',
				'--ignore-certificate-errors-spki-list',

				//https://github.com/sunny9577/proxy-scraper
				//'--proxy-server=socks5://212.83.143.97:38669',
				//'--proxy-server=socks5://212.83.143.97:38669',
				//'--proxy-server=socks5://115.127.10.154:1088',

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
			ignoreDefaultArgs: ['--enable-automation'],
		});

		console.error(2);
		//! OPERAR EN LA PAGINA
		// Abrir una nueva pagina
		//const context = await browser.createIncognitoBrowserContext({proxyServer:"socks5://"+ proxy.ip + ':' + proxy.port});
		//const context = await browser.createIncognitoBrowserContext();
		//const page = await context.newPage();
		// const page = await browser.newPage();

		// await page.setViewport({
		// 	width: 1080 + Math.floor(Math.random() * 100),
		// 	height: 1024 + Math.floor(Math.random() * 100),
		// 	deviceScaleFactor: 1,
		// 	hasTouch: false,
		// 	isLandscape: false,
		// 	isMobile: false,
		// });

		// //await page.setCacheEnabled(false)

		// const USER_AGENT =
		// 	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
		// // const userAgent = randomUseragent.getRandom();
		// // const UA = userAgent || USER_AGENT;
		// // await page.setUserAgent(UA);
		// await page.setUserAgent(USER_AGENT);

		//
		//
		//
		//
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

		//
		//
		//
		//
		//

		// await page.setJavaScriptEnabled(true);

		// await page.evaluateOnNewDocument(() => {
		// 	//pass webdriver check
		// 	Object.defineProperty(navigator, 'webdriver', {
		// 		get: () => false,
		// 	});
		// });

		// await page.evaluateOnNewDocument(() => {
		// 	//pass chrome check
		// 	// @ts-ignore
		// 	window.chrome = {
		// 		runtime: {},
		// 		// etc.
		// 	};
		// });

		// await page.evaluateOnNewDocument(() => {
		// 	//pass plugins check
		// 	const originalQuery = window.navigator.permissions.query;
		// 	return (window.navigator.permissions.query = parameters =>
		// 		// @ts-ignore
		// 		parameters.name === 'notifications'
		// 			? Promise.resolve({ state: Notification.permission })
		// 			: originalQuery(parameters));
		// });

		// await page.evaluateOnNewDocument(() => {
		// 	// Overwrite the `plugins` property to use a custom getter.
		// 	Object.defineProperty(navigator, 'plugins', {
		// 		// This just needs to have `length > 0` for the current test,
		// 		// but we could mock the plugins too if necessary.
		// 		get: () => [1, 2, 3, 4, 5],
		// 	});
		// });

		// await page.evaluateOnNewDocument(() => {
		// 	// Overwrite the `plugins` property to use a custom getter.
		// 	Object.defineProperty(navigator, 'languages', {
		// 		get: () => ['en-US', 'en'],
		// 	});
		// });

		var page = await pageInit(browser);

		//https://api.ipify.org?format=json
		//https://infosimples.github.io/detect-headless/

		page.on('dialog', async dialog => {
			await wait(1000);
			console.log('here');
			await dialog.accept();
		});

		console.error(3);
		await page.goto('https://infosimples.github.io/detect-headless/', { waitUntil: 'load', timeout: 50 * 1000 });
		await page.mouse.move(50, 50, { steps: 50 });
		await wait(1000);
		await page.mouse.move(0, 0, { steps: 50 });
		console.error(3.1);
		await wait(5000);
		await page.screenshot({ path: `00fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.png`, fullPage: true });
		const bodyHTML00 = await page.content();
		fs.writeFileSync(`00fullpage_INICIAL-${momentoFormateado('YYYYMMDD_HHmmss')}.html`, bodyHTML00);
		await wait(25000);

		console.error(3.4);
		await page.goto('https://api.ipify.org', { waitUntil: 'load', timeout: 50 * 1000 });
		console.error('a');
		// const ip = await page.evaluate(`async (() => document.body.textContent.trim())()`);
		const ip = await page.evaluate(() => document.body.textContent.trim());
		console.error('IP: ', ip);
		console.error('aa');
		await wait(1000);

		console.error('____ LALALA ____');
		// outputData.ban = true;
		// outputData.ultimaURL = url2;
		//! RETORNO EL OBJETO outputData por medio del console.log
		console.log(JSON.stringify(outputData)); // print out data to STDOUT -> outputData
		process.exit(1);
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

async function pageInit(browser) {
	var page,
		pages = await browser.pages();
	if (pages.length > 0) {
		page = pages[0];
	} else {
		page = await browser.newPage();
	}
	// await page.setExtraHTTPHeaders({
	// 	'Accept-Language': 'zh-CN,zh;q=0.9',
	// });

	// //User-Agent Test
	// await page.setUserAgent(
	// 	'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
	// );
	// await page.evaluateOnNewDocument(() => {
	// 	//Webdriver Test
	// 	Object.defineProperty(navigator, 'webdriver', {
	// 		get: () => false,
	// 	});
	// 	//connection.rtt Test
	// 	//@ts-ignore
	// 	Object.defineProperty(navigator.connection, 'rtt', {
	// 		get: () => 50,
	// 	});
	// 	//Plugins Length Test
	// 	Object.defineProperty(navigator, 'plugins', {
	// 		get: () => {
	// 			var ChromiumPDFPlugin = {};
	// 			//@ts-ignore
	// 			ChromiumPDFPlugin.__proto__ = PluginArray.prototype;
	// 			return [ChromiumPDFPlugin];
	// 		},
	// 	});

	// 	Object.defineProperty(navigator, 'plugins', {
	// 		get: () => {
	// 			var ChromiumPDFPlugin = {};
	// 			//@ts-ignore
	// 			ChromiumPDFPlugin.__proto__ = Plugin.prototype;
	// 			var plugins = {
	// 				0: ChromiumPDFPlugin,
	// 				description: 'Portable Document Format',
	// 				filename: 'internal-pdf-viewer',
	// 				length: 1,
	// 				name: 'Chromium PDF Plugin',
	// 				__proto__: PluginArray.prototype,
	// 			};
	// 			// const plugins = [
	// 			// 	{ name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
	// 			// 	{ name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
	// 			// 	{ name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
	// 			// ];
	// 			return plugins;
	// 		},
	// 	});
	// });

	// //Chrome Test
	// const trueChromeObject = {
	// 	app: { isInstalled: false },
	// 	webstore: { onInstallStageChanged: {}, onDownloadProgress: {} },
	// 	runtime: {
	// 		PlatformOs: { MAC: 'mac', WIN: 'win', ANDROID: 'android', CROS: 'cros', LINUX: 'linux', OPENBSD: 'openbsd' },
	// 		PlatformArch: { ARM: 'arm', X86_32: 'x86-32', X86_64: 'x86-64' },
	// 		PlatformNaclArch: { ARM: 'arm', X86_32: 'x86-32', X86_64: 'x86-64' },
	// 		RequestUpdateCheckStatus: {
	// 			THROTTLED: 'throttled',
	// 			NO_UPDATE: 'no_update',
	// 			UPDATE_AVAILABLE: 'update_available',
	// 		},
	// 		OnInstalledReason: {
	// 			INSTALL: 'install',
	// 			UPDATE: 'update',
	// 			CHROME_UPDATE: 'chrome_update',
	// 			SHARED_MODULE_UPDATE: 'shared_module_update',
	// 		},
	// 		OnRestartRequiredReason: { APP_UPDATE: 'app_update', OS_UPDATE: 'os_update', PERIODIC: 'periodic' },
	// 	},
	// };
	// await page.evaluateOnNewDocument(() => {
	// 	//@ts-ignore
	// 	chrome = {
	// 		app: { isInstalled: false },
	// 		webstore: { onInstallStageChanged: {}, onDownloadProgress: {} },
	// 		runtime: {
	// 			PlatformOs: { MAC: 'mac', WIN: 'win', ANDROID: 'android', CROS: 'cros', LINUX: 'linux', OPENBSD: 'openbsd' },
	// 			PlatformArch: { ARM: 'arm', X86_32: 'x86-32', X86_64: 'x86-64' },
	// 			PlatformNaclArch: { ARM: 'arm', X86_32: 'x86-32', X86_64: 'x86-64' },
	// 			RequestUpdateCheckStatus: {
	// 				THROTTLED: 'throttled',
	// 				NO_UPDATE: 'no_update',
	// 				UPDATE_AVAILABLE: 'update_available',
	// 			},
	// 			OnInstalledReason: {
	// 				INSTALL: 'install',
	// 				UPDATE: 'update',
	// 				CHROME_UPDATE: 'chrome_update',
	// 				SHARED_MODULE_UPDATE: 'shared_module_update',
	// 			},
	// 			OnRestartRequiredReason: { APP_UPDATE: 'app_update', OS_UPDATE: 'os_update', PERIODIC: 'periodic' },
	// 		},
	// 	};
	// 	//@ts-ignore
	// 	window.chrome = {
	// 		app: { isInstalled: false },
	// 		webstore: { onInstallStageChanged: {}, onDownloadProgress: {} },
	// 		runtime: {
	// 			PlatformOs: { MAC: 'mac', WIN: 'win', ANDROID: 'android', CROS: 'cros', LINUX: 'linux', OPENBSD: 'openbsd' },
	// 			PlatformArch: { ARM: 'arm', X86_32: 'x86-32', X86_64: 'x86-64' },
	// 			PlatformNaclArch: { ARM: 'arm', X86_32: 'x86-32', X86_64: 'x86-64' },
	// 			RequestUpdateCheckStatus: {
	// 				THROTTLED: 'throttled',
	// 				NO_UPDATE: 'no_update',
	// 				UPDATE_AVAILABLE: 'update_available',
	// 			},
	// 			OnInstalledReason: {
	// 				INSTALL: 'install',
	// 				UPDATE: 'update',
	// 				CHROME_UPDATE: 'chrome_update',
	// 				SHARED_MODULE_UPDATE: 'shared_module_update',
	// 			},
	// 			OnRestartRequiredReason: { APP_UPDATE: 'app_update', OS_UPDATE: 'os_update', PERIODIC: 'periodic' },
	// 		},
	// 	};
	// 	//@ts-ignore
	// 	window.navigator.chrome = {
	// 		app: { isInstalled: false },
	// 		webstore: { onInstallStageChanged: {}, onDownloadProgress: {} },
	// 		runtime: {
	// 			PlatformOs: { MAC: 'mac', WIN: 'win', ANDROID: 'android', CROS: 'cros', LINUX: 'linux', OPENBSD: 'openbsd' },
	// 			PlatformArch: { ARM: 'arm', X86_32: 'x86-32', X86_64: 'x86-64' },
	// 			PlatformNaclArch: { ARM: 'arm', X86_32: 'x86-32', X86_64: 'x86-64' },
	// 			RequestUpdateCheckStatus: {
	// 				THROTTLED: 'throttled',
	// 				NO_UPDATE: 'no_update',
	// 				UPDATE_AVAILABLE: 'update_available',
	// 			},
	// 			OnInstalledReason: {
	// 				INSTALL: 'install',
	// 				UPDATE: 'update',
	// 				CHROME_UPDATE: 'chrome_update',
	// 				SHARED_MODULE_UPDATE: 'shared_module_update',
	// 			},
	// 			OnRestartRequiredReason: { APP_UPDATE: 'app_update', OS_UPDATE: 'os_update', PERIODIC: 'periodic' },
	// 		},
	// 	};
	// });

	// //Permissions Test
	// await page.evaluateOnNewDocument(() => {
	// 	const originalQuery = window.navigator.permissions.query;
	// 	//@ts-ignore
	// 	return (window.navigator.permissions.query = parameters =>
	// 		//@ts-ignore
	// 		parameters.name === 'notifications'
	// 			? Promise.resolve({ state: Notification.permission })
	// 			: originalQuery(parameters));
	// });

	// //Languages Test
	// await page.evaluateOnNewDocument(() => {
	// 	Object.defineProperty(navigator, 'languages', {
	// 		get: () => ['zh-CN'],
	// 	});
	// });

	return page;
}
