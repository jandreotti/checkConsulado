// import Paciente from '../models/Paciente.js';

import axios from 'axios';
import qr from 'qr-image';
import { Estado } from '../interfaces/estado';
import { Client } from 'whatsapp-web.js';
// import client from '../client';
// import { Client } from 'whatsapp-web.js';

//
const mandarMensage = async (req, res, next) => {
	//* Metodo que manda un nuevo mensaje a un numero de telefono obteniendo la informacion del body
	// {
	//     "number":"+5493515427401",
	//     "text":"Hola Charly, sobame los huevitos :)"
	// }

	const { number, text } = req.body; //

	// Getting chatId from the number.
	// we have to delete "+" from the beginning and add "@c.us" at the end of the number.
	const chatId = number.substring(1) + '@c.us';

	try {
		await globalThis.client.sendMessage(chatId, text);

		res.json('Mensaje Enviado');
	} catch (err) {
		res.status(404).send(err);
	}
};

const probar = async (req, res, next) => {
	//* Probar el endpoint anterior con axios
	const { data } = await axios.post('http://localhost:4000/mandarMensaje', {
		number: '+5493515427401',
		text: 'hola',
	});

	res.json({ data });
};

const putearPollo = async (req, res, next) => {
	// Number where you want to send the message.
	const number = '+5493516461960';

	// Your message.
	const text = 'Pollo Putaso!';

	// Getting chatId from the number.
	// we have to delete "+" from the beginning and add "@c.us" at the end of the number.
	const chatId = number.substring(1) + '@c.us';

	try {
		await globalThis.client.sendMessage(chatId, text);

		res.json('Pollito Puteado');
	} catch (err) {
		res.status(404).send(err);
	}
};

const putearCarlitos = async (req, res, next) => {
	const number = '+5493515427401';
	const text = 'Carlitos Putazo!';
	const chatId = number.substring(1) + '@c.us';
	try {
		for (let i = 0; i < 20; i++) {
			console.log(i);
			await globalThis.client.sendMessage(chatId, `${text} ${i}`);
		}

		res.json('Carlitos Puteado');
	} catch (err) {
		res.status(404).send(err);
	}
};

const qrImage = async (req, res, next) => {
	// const qr = await globalThis.client.qrCode;

	// res
	// 	.status(200)
	// 	.send(
	// 		'<html> <head>server Response</head><body><h1> This page was render direcly from the server <p>Hello there welcome to my website</p></h1></body></html>'
	// 	);

	// var qr_svg = qr.image('I love QR!', { type: 'svg' });
	// qr_svg.pipe(require('fs').createWriteStream('lala.svg'));

	const estados = globalThis.estados as Estado[];
	const estadosStr = estados
		.map(estado => {
			return `   - ${estado.estado}`;
		})
		.join('\n');

	const estadoActual = estados[estados.length - 1].estado;

	//Fecha ultimo estado
	let fecha = "";
	try {
		const fechaEstado = estados[estados.length - 1].fecha;
		const day = fechaEstado.getDate() + "";
		const month = (fechaEstado.getMonth() + 1) + "";
		const year = fechaEstado.getFullYear() + "";
		const hour = fechaEstado.getHours() + "";
		const minutes = fechaEstado.getMinutes() + "";
		const seconds = fechaEstado.getSeconds() + "";
		fecha = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
	}
	catch (err) {
		console.log(err);
		fecha = "Sin fecha (ERROR)";
	}


	const qrCode = globalThis.qrCode;

	let html = '';
	let htmlCode = '';

	if (qrCode) {
		var svg_string = qr.imageSync(qrCode, { type: 'svg' });
		htmlCode = `
			<div style="width:300px;height:300px">
				${svg_string}
			</div>
		`;
	} else {
		htmlCode = `
			<div style="width:300px;height:300px">
				<p>QR NO DISPONIBLE</p>
			</div>
		`;
	}

	html = `
		<html>
			<head>
				<title>QR</title>
			</head>
			<body>
				<h1>(QR) (Estado Actual: ${estadoActual} ) ->   {${fecha}}</h1>
				${htmlCode}

				<label>QR: \n${qrCode}</label>
				<br/><br/>
				<label style="white-space: pre-wrap">ESTADOS: \n${estadosStr}</label>
			</body>

		</html>
	`;

	res.status(200).send(html);
};

export { mandarMensage, probar, putearPollo, putearCarlitos, qrImage };
