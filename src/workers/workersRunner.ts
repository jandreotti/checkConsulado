//! FUENTE ORIGINAL: https://devforth.io/blog/how-to-simply-workaround-ram-leaking-libraries-like-puppeteer-universal-way-to-fix-ram-leaks-once-and-forever/
// https://github.com/puppeteer/puppeteer/issues/5893

import { spawn } from 'child_process';
import path from 'path';
import { momento, momentoFormateado, wait } from '../helpers/momento';
import { ejecutar } from './runner';
import { IOutputData_WCheckDolar } from './wCheckDolar';
import { getNewPageWhenLoaded } from '../helpers/puppeteer-helper';
import { IInputData_WCheckCitaPasaporte, IOutputData_WCheckCitaPasaporte } from './wCheckCitaPasaporte';
import { IInputData_WCheckCitaLMDLahabana, IOutputData_WCheckCitaLMDLahabana } from './wCheckCitaLMDLahabana';
import { log } from '../helpers/helpers';
// const __dirnamee = path.resolve(); //C:\Users\computadora\Desktop\WSP\wsp-example
// console.log(__dirname); //C:\Users\computadora\Desktop\WSP\wsp-example\dist\workers

//! DEFINICION DE VARIABLES
export let dolarBlueCompra = 0;
export let dolarBlueVenta = 0;
let lastCheck = 0;

export const runCheckDolar = async data => {
	console.log(`\n[${momento()}] runCheckDolar START`);
	const actualCheck = Date.now();

	//! VALIDACIONES
	const estados = globalThis.estados;
	if (!estados) {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}
	const estadoActual = globalThis.estados[estados.length - 1].estado;
	if (estadoActual !== 'LISTO') {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}

	//! EJECUCION DEL PROCESO HIJO
	const retorno = await ejecutar({
		filename: 'wCheckDolar.js', // Archivo a ejecutar
		data, // Datos a enviar al proceso hijo (osea al archivo wCheckDolar.js en el inputData)
		tagProcess: 'worker-check-dolar', // Tag para identificar el proceso hijo
		debug: false, // Si se quiere ver el log del proceso hijo que largue con console.error
	});

	//! PROCESAMIENTO DEL RESULTADO
	const { compra, venta } = retorno as IOutputData_WCheckDolar;
	console.log(`runCheckDolar valores: Compra:${compra} - Venta:${venta}`);

	//! VALIDACIONES
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

	// validacion para que no chequee una compra/venta nula
	if (!compra || !venta) {
		console.log(`[${momento()}] runCheckDolar -> Fin Chequeo por compra/venta nula...`, { compra, venta });
		return;
	}

	//! PROCESAMIENTO DEL RESULTADO
	if (dolarBlueCompra != parseFloat(compra) || dolarBlueVenta != parseFloat(venta)) {

		console.log(`      ------> runCheckDolar -> Cambio el dolar -> AVISAR! Compra:${compra} - Venta:${venta}`);

		console.log({
			mensaje: 'AVISO DE CAMBIO DE DOLAR',
			compra,
			venta,
			dolarBlueCompra,
			dolarBlueVenta,
		});

		const diferenciaCompra = parseFloat(compra) - dolarBlueCompra;
		const diferenciaVenta = parseFloat(venta) - dolarBlueVenta;

		dolarBlueCompra = parseFloat(compra);
		dolarBlueVenta = parseFloat(venta);

		//Enviar Mensaje
		//const chatIds = ['5493515925801@c.us', '5493512298961@c.us', '5493516461960@c.us', '5493541521564@c.us'];
		// const chatIds = ['5493515925801@c.us'];
		const chatIds = ['120363166505865460@g.us']; //GRUPO DOLARITOR

		const text = `Cambio la cotizacion del dolar:

Compra: $${compra} (${diferenciaCompra > 0 ? '+' : ''}${diferenciaCompra})
Venta:     *$${venta} (${diferenciaVenta > 0 ? '+' : ''}${diferenciaVenta})*`;

		for (const chatId of chatIds) {
			await globalThis.client.sendMessage(chatId, text);
		}
	}
	else {
		console.log(`[${momento()}] runCheckDolar -> Fin Chequeo sin cambios... Compra:${compra} - Venta:${venta}`);
	}
};

export const runCheckTurnosPasaporte = async (port: string = "") => {
	console.log(`\n[${momento()}] runCheckTurnosPasaporte START`);

	// //! VALIDACIONES
	const estados = globalThis.estados;
	if (!estados) {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}
	const estadoActual = globalThis.estados[estados.length - 1].estado;
	if (estadoActual !== 'LISTO') {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}

	const data = {
		port,
	} as IInputData_WCheckCitaPasaporte;

	//! EJECUCION DEL PROCESO HIJO
	const retorno = await ejecutar({
		filename: 'wCheckCitaPasaporte.js', // Archivo a ejecutar
		data, // Datos a enviar al proceso hijo (osea al archivo wCheckCitaPasaporte.js en el inputData)
		tagProcess: 'worker-check-cita-pasaporte', // Tag para identificar el proceso hijo
		debug: false, // Si se quiere ver el log del proceso hijo que largue con console.error
	});

	//! PROCESAMIENTO DEL RESULTADO
	const {
		idDivNotAvailableSlotsTextTop,
		idTimeListTable,
		nuevaURL,
		idDivSlotColumnContainer_1,
		valueIdDivBktDatetimeSelectedDate,
		error,
	} = retorno as IOutputData_WCheckCitaPasaporte;


	log(
		JSON.stringify(
			{
				retorno,
				fecha: momentoFormateado('YYYYMMDD_HHmmss'),
				error: error ? "SI HAY ERROR!!!!!!!" : '',
			},
			null,
			2
		)
	);

	if (error) console.log("SI HAY ERROR !!!!!!!!!!!!!!!!!!");


	console.log({
		idDivNotAvailableSlotsTextTop,
		idTimeListTable,
		nuevaURL,
		idDivSlotColumnContainer_1,
		valueIdDivBktDatetimeSelectedDate,

		// avisarViejo: !idDivNotAvailableSlotsTextTop && idTimeListTable && nuevaURL.includes('#datetime'),
		// avisarNuevo:
		// 	!idDivNotAvailableSlotsTextTop &&
		// 	idTimeListTable &&
		// 	nuevaURL.includes('#datetime') &&
		// 	idDivSlotColumnContainer_1 &&
		// 	valueIdDivBktDatetimeSelectedDate != '',
		error,
	});

	// AVISO NUEVO
	if (
		!idDivNotAvailableSlotsTextTop &&
		idTimeListTable &&
		nuevaURL.includes('#datetime') &&
		idDivSlotColumnContainer_1 &&
		valueIdDivBktDatetimeSelectedDate != ''
	) {
		console.log(' 	------> runCheckTurnosPasaporte -> Hay turnos disponibles -> AVISAR!');
		//Enviar Mensaje
		// const chatIds = ['5493515925801@c.us', '5493513041739@c.us']; //Yo y Fer
		//const chatIds = ['5493515925801@c.us','5493515312948@c.us']; //Yo y Pupi.
		//const chatIds = ['5493515925801@c.us']; //Yo
		const chatIds = ['120363163745507206@g.us']; //GRUPO PASAPORTES CONSULADO CORDOBA ESPAÑA

		const text = `Verificar Cita para renovar pasaporte: (${valueIdDivBktDatetimeSelectedDate})

https://www.exteriores.gob.es/Consulados/cordoba/es/ServiciosConsulares/Paginas/index.aspx?scco=Argentina&scd=129&scca=Pasaportes+y+otros+documentos&scs=Pasaportes+-+Requisitos+y+procedimiento+para+obtenerlo
		`;
		for (const chatId of chatIds) {
			await globalThis.client.sendMessage(chatId, text);
		}
	} else {
		console.log(' 	------> runCheckTurnosPasaporte -> No hay turnos disponibles');
	}
};

export const runCheckCitaLMDLahabana = async (port: string) => {
	console.log(`\n\n\n\n\n\n\n\n\n\n[${momento()}] runCheckCitaLMDLahabana START`);
	log(`\n\n\n\n\n\n\n\n\n\n[${momento()}] runCheckCitaLMDLahabana START`);

	//! VALIDACIONES
	const estados = globalThis.estados;
	if (!estados) {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}
	const estadoActual = globalThis.estados[estados.length - 1].estado;
	if (estadoActual !== 'LISTO') {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}

	const data = {
		port,
	} as IInputData_WCheckCitaLMDLahabana;

	//! EJECUCION DEL PROCESO HIJO
	const retorno = (await ejecutar({
		filename: 'wCheckCitaLMDLahabana.js', // Archivo a ejecutar
		data, // Datos a enviar al proceso hijo (osea al archivo wCheckCitaPasaporte.js en el inputData)
		tagProcess: 'worker-check-cita-lmd-lahabana', // Tag para identificar el proceso hijo
		debug: true, // Si se quiere ver el log del proceso hijo que largue con console.error
	})) as IOutputData_WCheckCitaLMDLahabana;

	//! PROCESAMIENTO DEL RESULTADO
	const { idDivBktServicesContainer_textContext, error, ban, ultimaURL, verificar } = retorno;

	console.log({
		retorno,

		// idDivBktServicesContainer_textContext,
		// ban,
		// ultimaURL,

		// idDivNotAvailableSlotsTextTop,
		// idTimeListTable,
		// nuevaURL,
		// idDivSlotColumnContainer_1,
		// valueIdDivBktDatetimeSelectedDate,

		// avisarViejo: !idDivNotAvailableSlotsTextTop && idTimeListTable && nuevaURL.includes('#datetime'),
		// avisarNuevo:
		// 	!idDivNotAvailableSlotsTextTop &&
		// 	idTimeListTable &&
		// 	nuevaURL.includes('#datetime') &&
		// 	idDivSlotColumnContainer_1 &&
		// 	valueIdDivBktDatetimeSelectedDate != '',
		// error,
		fecha: momentoFormateado('YYYYMMDD_HHmmss'),
	});
	log(
		JSON.stringify(
			{
				retorno,
				fecha: momentoFormateado('YYYYMMDD_HHmmss'),
			},
			null,
			2
		)
	);

	// AVISOS
	if (ban) {
		console.log(' 	------> runCheckCitaLMDLahabana -> BANEADO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		log(' 	------> runCheckCitaLMDLahabana -> BANEADO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		return;
	}

	if (error && error.timeout) {
		console.log(' 	------> runCheckCitaLMDLahabana -> TIMEOUT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		log(' 	------> runCheckCitaLMDLahabana -> TIMEOUT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		return;
	}

	if (error && error.proxyError) {
		console.log(' 	------> runCheckCitaLMDLahabana -> PROXY ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		log(' 	------> runCheckCitaLMDLahabana -> PROXY ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		return;
	}

	if (error) {
		console.log(' 	------> runCheckCitaLMDLahabana -> ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		log(' 	------> runCheckCitaLMDLahabana -> ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		return;
	}

	//Chequeo si hay cita disponible
	if (
		// !idDivNotAvailableSlotsTextTop &&
		// idTimeListTable &&
		// nuevaURL.includes('#datetime') &&
		// idDivSlotColumnContainer_1 &&
		// valueIdDivBktDatetimeSelectedDate != ''
		idDivBktServicesContainer_textContext != 'No hay horas disponibles.' ||
		verificar
	) {
		console.log(
			' 	------> runCheckCitaLMDLahabana -> Hay turnos disponibles -> AVISAR! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
		);
		log(
			' 	------> runCheckCitaLMDLahabana -> Hay turnos disponibles -> AVISAR! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
		);
		//Enviar Mensaje
		// const chatIds = ['5493515925801@c.us', '5493513041739@c.us']; //Yo y Fer
		//const chatIds = ['5493515925801@c.us','5493515312948@c.us']; //Yo y Pupi.
		//const chatIds = ['5493515925801@c.us']; //Yo
		const chatIds = ['120363146280744024@g.us']; //GRUPO LMD la habana

		const {
			idDivNotAvailableSlotsTextTop,
			idTimeListTable,
			nuevaURL,
			idDivSlotColumnContainer_1,
			valueIdDivBktDatetimeSelectedDate,
		} = retorno.otros as any;

		const text = `Verificar Cita para LMH La Habana  (${valueIdDivBktDatetimeSelectedDate})

		 https://www.exteriores.gob.es/Consulados/lahabana/es/ServiciosConsulares/Paginas/cita4LMD.aspx


		 \n

			${JSON.stringify(
			{
				retorno,
				fecha: momentoFormateado('YYYYMMDD_HHmmss'),
				chequeoAnterior:
					!idDivNotAvailableSlotsTextTop &&
					idTimeListTable &&
					nuevaURL.includes('#datetime') &&
					idDivSlotColumnContainer_1 &&
					valueIdDivBktDatetimeSelectedDate != '',
			},
			null,
			2
		)}


			`;
		for (const chatId of chatIds) {
			await globalThis.client.sendMessage(chatId, text);
		}
	} else {
		const chatIds = ['120363146280744024@g.us']; //GRUPO LMD la habana
		for (const chatId of chatIds) {
			await globalThis.client.sendMessage(chatId, 'NADA');
		}
		console.log(' 	------> runCheckCitaLMDLahabana -> No hay turnos disponibles');
		log(' 	------> runCheckCitaLMDLahabana -> No hay turnos disponibles');
	}
};
