import puppeteer, { TimeoutError } from 'puppeteer';
import { momento, momentoFormateado, wait } from '../helpers/momento';
// import { getNewPageWhenLoaded } from '../helpers/puppeteer-helper';
import fs from 'fs';

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
				'--no-sandbox',
				'--disable-setuid-sandbox',
				// '--disable-background-timer-throttling',
				// '--disable-backgrounding-occluded-windows',
				// '--disable-renderer-backgrounding',
			],
			headless: 'new', // trabaja en background ->  con este anda bien el waitforNetworkIdle
			//  headless: false, //  VIEJO -> para ver que hace el explorador en la pagina
			// headless: true, //  para que no se vea lo que hace el explorador en la pagina
			// slowMo: 200, // Camara lenta para ver que hace el explorador
		});

		console.error(2);
		//! OPERAR EN LA PAGINA
		// Abrir una nueva pagina
		const page = await browser.newPage();

  await page.setViewport({
        width: 1920,
        height: 1080
  })

		
		await page.setCacheEnabled(false)
		// const ua =
		// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
		// await page.setUserAgent(ua);
		await page.goto(url, { waitUntil: 'load' });

		console.error(3);
		// Hacer click en el boton
		const a = await page.$(
			"a[href='https://www.citaconsular.es/es/hosteds/widgetdefault/28330379fc95acafd31ee9e8938c278ff']"
		);

await Promise.all([
		 a.click(),
   wait(5000),
   page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40 * 1000 })
]);
		console.error(4);
		// Esperar a que se cargue la nueva pagina
		// const newPagePromise = await getNewPageWhenLoaded(browser);
		// const page2 = (await newPagePromise) as puppeteer.Page;
		// await page.waitForNavigation({ timeout: 40 * 1000 });
		//await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40 * 1000 });
		// await page.waitForNavigation({ timeout: 20 });
		// await wait(5000);
		console.error(5);

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

		/// Obtener el boton de continuar y presionarlo

		const bktContinue = await page.$('#idCaptchaButton');
		
  await Promise.all([
  bktContinue.click(),
  wait(5000),
  page.waitForNetworkIdle({
			 timeout: 50 * 1000,
		 })
   ]);

		//console.error(7);

		//obtener la parte de abajo y presionarla para continuar
		// const idBktDefaultServicesContainer = await page2.$('#idBktDefaultServicesContainer');
		// await idBktDefaultServicesContainer.click();

		// Esto de aqui lo pongo para que este activa la pagina y funcione lo de abajo (AL FINAL SE SOLUCIONO CON headless: 'new',)
		//FUENTE: https://github.com/puppeteer/puppeteer/issues/3339
		// const session = await page.target().createCDPSession();
		// await session.send('Page.enable');
		// await session.send('Page.setWebLifecycleState', { state: 'active' });
		console.error(8);

		//await page.waitForNetworkIdle({
			//timeout: 50 * 1000,
		//});

		await wait(3000);

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

			//obtener la parte de abajo y presionarla para continuar
			const idBktDefaultServicesContainer = await page.$('#idBktDefaultServicesContainer');
			await idBktDefaultServicesContainer.click();

			// await wait(15000);
			// esperar a que cargue la pagina
			await page.waitForNetworkIdle();
			await wait(3000);

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
					error: 'HUBO ERROR',
					message: error?.message,
					timeout: error instanceof TimeoutError,
					objeto: JSON.stringify(error),
				},
			})
		); // print out data to STDOUT
	}

	//! Esto es clave para que salga, porque a veces no salia
	process.exit(1);
};

run();
