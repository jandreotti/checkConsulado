import axios from 'axios';
import moment from 'moment';
import { momento } from './momento';

//VARIABLES
let trozoCodigoPagina = `<div class=single__text> <div> <h2>AVISO IMPORTANTE SOBRE LA LEY DE MEMORIA DEMOCRÁTICA (A 27/10/2022)&#58;​<br></h2><div><div>En relación con los derechos contenidos en la Ley de Memoria Democrática,&#160;este Consulado General informa que&#160;la reglamentación ha sido publicada y, junto con formularios de solicitud, se encuentra a disposición en la sección &quot;Servicios Consulares&quot;,&#160;&quot;Nacionalidad&quot;, &quot;Nacionalidad Española por Ley de Memoria Democrática&quot;; o bien pinchando en el siguiente <a href="/Consulados/cordoba/es/ServiciosConsulares/Paginas/index.aspx?scco=Argentina&amp;scd=129&amp;scca=Nacionalidad&amp;scs=Nacionalidad+espa%C3%B1ola+por+la+Ley+de+Memoria+Democr%C3%A1tica">enlace​</a>.<br></div><div><strong>Próximamente se informará en esta web de las modalidades de cita previa para este trámite y la dirección de correo electrónico por la que realizar consultas relativas.</strong></div><div><b>Si desea más información&#160;al respecto, le recomendamos ingresar en el siguiente <a href=/es/Documents/Ley%20de%20memoria%20democratica.pdf target=_blank title="Se abre en ventana nueva: Ley de Memoria Democrática">enlace​<img src=/Style%20Library/PC/Img/icons/icon-external-link.svg alt="Se abre en ventana nueva" class="icon-external-link noLazy"></a>.&#160;</b></div>`;
let stringOriginalAChekear = ``;

//FUNCIONES
export const checkPage = async () => {
	// const fecha = moment().format('DD/MM/YYYY HH:mm:ss');
	console.log(`[${momento()}] Checkeando Pagina...`);

	const estados = globalThis.estados;
	const estadoActual = globalThis.estados[estados.length - 1].estado;
	if (estadoActual !== 'LISTO') {
		console.log('Cliente de whastapp-web.js no esta listo');
		return;
	}
	console.log(1);
	const { data } = await axios.get<string>('https://www.exteriores.gob.es/Consulados/cordoba/es/Paginas/index.aspx');
	console.log(2);
	const main = data.split('<main>')[1];
	console.log(3);

	// console.log({ stringACheckear: md5(stringOriginalAChekear) });
	// console.log({ main: md5(main) });

	if (stringOriginalAChekear === '' && main.includes(trozoCodigoPagina)) {
		stringOriginalAChekear = main;
		//Enviar Mensaje
		const chatId = '5493515925801-1556554776@g.us';
		const text = 'Iniciado chequeo de pagina';
		await globalThis.client.sendMessage(chatId, text);
		return;
	}

	if (main != stringOriginalAChekear) {
		console.log('      ------> Cambio la pagina -> AVISAR!\n');

		stringOriginalAChekear = main;

		//Enviar Mensaje
		const chatId = '5493515925801-1556554776@g.us';
		const text =
			'Hay un cambio en la pagina de la embajada -> https://www.exteriores.gob.es/Consulados/cordoba/es/Paginas/index.aspx';
		await globalThis.client.sendMessage(chatId, text);
	}
};
