//! FUENTE ORIGINAL: https://devforth.io/blog/how-to-simply-workaround-ram-leaking-libraries-like-puppeteer-universal-way-to-fix-ram-leaks-once-and-forever/
// https://github.com/puppeteer/puppeteer/issues/5893

import { spawn } from 'child_process';
import path from 'path';
import { momento, wait } from '../helpers/momento';
import { ejecutar } from './runner';
import { IOutputData_WCheckDolar } from './wCheckDolar';
import puppeteer from 'puppeteer';
import { getNewPageWhenLoaded } from '../helpers/puppeteer-helper';
import { IOutputData_WCheckCitaPasaporte } from './wCheckCitaPasaporte';
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
		console.log(`      ------> runCheckDolar -> Cambio el dolar -> AVISAR!`);

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
		const chatIds = ['5493515925801@c.us', '5493512298961@c.us', '5493516461960@c.us', '5493541521564@c.us'];
		// const chatIds = ['5493515925801@c.us'];

		const text = `Cambio la cotizacion del dolar:

Compra: $${compra} (${diferenciaCompra > 0 ? '+' : ''}${diferenciaCompra})
Venta:     *$${venta} (${diferenciaVenta > 0 ? '+' : ''}${diferenciaVenta})*`;

		for (const chatId of chatIds) {
			await globalThis.client.sendMessage(chatId, text);
		}
	}
};

export const runCheckTurnosPasaporte = async () => {
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

	//! EJECUCION DEL PROCESO HIJO
	const retorno = await ejecutar({
		filename: 'wCheckCitaPasaporte.js', // Archivo a ejecutar
		// data, // Datos a enviar al proceso hijo (osea al archivo wCheckCitaPasaporte.js en el inputData)
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
		// const chatIds = ['5493515925801@c.us', '5493513041739@c.us'];
		const chatIds = ['5493515925801@c.us','5493515312948@c.us'];

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
