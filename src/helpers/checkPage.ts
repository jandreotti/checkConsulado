import axios from 'axios';
import moment from 'moment';
import { momento } from './momento';
import puppeteer from 'puppeteer';

//VARIABLES
let trozoCodigoPagina = `<div class=single__text> <div> <h2>AVISO IMPORTANTE SOBRE LA LEY DE MEMORIA DEMOCRÁTICA (A 27/10/2022)&#58;​<br></h2><div><div>En relación con los derechos contenidos en la Ley de Memoria Democrática,&#160;este Consulado General informa que&#160;la reglamentación ha sido publicada y, junto con formularios de solicitud, se encuentra a disposición en la sección &quot;Servicios Consulares&quot;,&#160;&quot;Nacionalidad&quot;, &quot;Nacionalidad Española por Ley de Memoria Democrática&quot;; o bien pinchando en el siguiente <a href="/Consulados/cordoba/es/ServiciosConsulares/Paginas/index.aspx?scco=Argentina&amp;scd=129&amp;scca=Nacionalidad&amp;scs=Nacionalidad+espa%C3%B1ola+por+la+Ley+de+Memoria+Democr%C3%A1tica">enlace​</a>.<br></div><div><strong>Próximamente se informará en esta web de las modalidades de cita previa para este trámite y la dirección de correo electrónico por la que realizar consultas relativas.</strong></div><div><b>Si desea más información&#160;al respecto, le recomendamos ingresar en el siguiente <a href=/es/Documents/Ley%20de%20memoria%20democratica.pdf target=_blank title="Se abre en ventana nueva: Ley de Memoria Democrática">enlace​<img src=/Style%20Library/PC/Img/icons/icon-external-link.svg alt="Se abre en ventana nueva" class="icon-external-link noLazy"></a>.&#160;</b></div>`;
let stringOriginalAChekear = ``;

//FUNCIONES
export const checkConsuladoPage = async () => {
	// const fecha = moment().format('DD/MM/YYYY HH:mm:ss');
	console.log(`\n[${momento()}] checkConsuladoPage -> Checkeando Pagina...`);

	const estados = globalThis.estados;
	const estadoActual = globalThis.estados[estados.length - 1].estado;
	if (estadoActual !== 'LISTO') {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}

	try {
		const { data } = await axios.get<string>('https://www.exteriores.gob.es/Consulados/cordoba/es/Paginas/index.aspx');

		const main = data.split('<main>')[1];

		// console.log({ stringACheckear: md5(stringOriginalAChekear) });
		// console.log({ main: md5(main) });

		if (stringOriginalAChekear === '' && main.includes(trozoCodigoPagina)) {
			stringOriginalAChekear = main;
			//Enviar Mensaje
			// const chatId = '5493515925801-1556554776@g.us';
			const chatId = '5493515925801@c.us';
			const text = 'Iniciado chequeo de pagina';
			await globalThis.client.sendMessage(chatId, text);
			return;
		}

		if (main != stringOriginalAChekear) {
			console.log('      ------> Cambio la pagina -> AVISAR!\n');

			stringOriginalAChekear = main;

			//Enviar Mensaje
			const chatId = '5493515925801@c.us';
			const text =
				'Hay un cambio en la pagina de la embajada -> https://www.exteriores.gob.es/Consulados/cordoba/es/Paginas/index.aspx';
			await globalThis.client.sendMessage(chatId, text);
		}
	} catch (error) {
		console.log({ errorCheckConsuladoPage: error });
	}
};

export let dolarBlueCompra = 0;
export let dolarBlueVenta = 0;

export const checkDolarBlueCordoba = async () => {
	console.log(`\n[${momento()}] Checkeando Dolar...`);

	const estados = globalThis.estados;
	const estadoActual = globalThis.estados[estados.length - 1].estado;
	if (estadoActual !== 'LISTO') {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}

	try {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
		const page = await browser.newPage();
		// await page.goto('https://www.dolarhoy.com/cotizacion-dolar-blue-hoy-cordoba');
		await page.goto('https://www.infodolar.com/cotizacion-dolar-provincia-cordoba.aspx');
		const dolarBlue = await page.evaluate(() => {
			const compra = document
				.querySelector('#BluePromedio')
				?.querySelectorAll('.colCompraVenta')[0]
				?.textContent.trim()
				.split('\n')[0]
				.replace('$', '')
				.replace(',', '.');

			const venta = document
				.querySelector('#BluePromedio')
				?.querySelectorAll('.colCompraVenta')[1]
				?.textContent.trim()
				.split('\n')[0]
				.replace('$', '')
				.replace(',', '.');

			return { compra, venta };
		});

		await browser.close();

		const { compra, venta } = dolarBlue;

		if (dolarBlueCompra === 0 && dolarBlueVenta === 0) {
			dolarBlueCompra = parseFloat(compra);
			dolarBlueVenta = parseFloat(venta);
			console.log(`[${momento()}] Fin Primer Chequeo...`);
			return;
		}

		if (dolarBlueCompra != parseFloat(compra) || dolarBlueVenta != parseFloat(venta)) {
			console.log('      ------> Cambio el dolar -> AVISAR!');

			const diferenciaCompra = parseFloat(compra) - dolarBlueCompra;
			const diferenciaVenta = parseFloat(venta) - dolarBlueVenta;

			dolarBlueCompra = parseFloat(compra);
			dolarBlueVenta = parseFloat(venta);

			//Enviar Mensaje

			const chatIds = ['5493515925801@c.us', '5493512298961@c.us', '5493516461960@c.us'];
			// const chatIds = ['5493515925801@c.us'];

			const text = `Cambio la cotizacion del dolar:

Compra: $${compra} (${diferenciaCompra > 0 ? '+' : ''}${diferenciaCompra})
Venta:     *$${venta} (${diferenciaVenta > 0 ? '+' : ''}${diferenciaVenta})*`;

			for (const chatId of chatIds) {
				await globalThis.client.sendMessage(chatId, text);
			}
		}
	} catch (error) {
		console.log({ errorCheckDolarBlueCordoba: error });
	}

	console.log(`[${momento()}] Fin Chequeo...`);
};
