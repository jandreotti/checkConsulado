import axios from 'axios';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { Estado } from './interfaces/estado';
import os from 'os-utils';
import { hostname } from 'os';

import { momento, momentoSecondsToTime2 } from './helpers/momento';
import { log } from './helpers/helpers';
import { dolarBlueCompra, dolarBlueVenta } from './workers/workersRunner';
import { numberToDecimalString } from './helpers/formatters';

const destroyClient = async starter => {
	log(`[${momento()}] WSP INFO: (${starter}) Shutting down...`, "wsp.log");
	console.log(`(${starter}) Shutting down...`);
	await globalThis.client.destroy();
	process.exit(0);
};

export const iniciarCliente = async () => {
	console.log("Iniciar Cliente: Creando cliente");
	const client = new Client({
		authStrategy: new LocalAuth(),
		puppeteer: {
			handleSIGINT: false,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		},

		// puppeteer: { headless: true }, // Make headless true or remove to run browser in background
		// puppeteer: {
		//     headless: true,
		//     args: [
		//         '--no-sandbox',
		//         '--disable-setuid-sandbox',
		//         '--disable-dev-shm-usage',
		//         '--disable-accelerated-2d-canvas',
		//         '--no-first-run',
		//         '--no-zygote',
		//         '--single-process', // <- this one doesn't works in Windows
		//         '--disable-gpu'
		//     ],
		// },
	});
	console.log("Iniciar Cliente: Creando cliente FIN");


	// VARIABLES GLOBALES
	console.log("Iniciar Cliente: Creando variables globales");
	globalThis.client = client;

	globalThis.estados = [
		{
			estado: 'INICIANDO',
			valor: 0,
		} as Estado,
	];
	console.log("Iniciar Cliente: Creando variables globales FIN");


	// EVENTOS
	console.log("Iniciar Cliente: Creando eventos");

	client.on('loading_screen', (percent, message) => {
		console.log('LOADING', percent, message);
		log(`[${momento()}] WSP INFO: loading_screen ${percent} _ ${message}`, "wsp.log");
		globalThis.estado = globalThis.estados.push({
			estado: 'INICIANDO',
			valor: percent,
		} as Estado);
	});

	client.on('authenticated', session => {
		console.log('AUTHENTICATED');
		log(`[${momento()}] WSP INFO: authenticated`, "wsp.log");
		globalThis.estado = globalThis.estados.push({
			estado: 'AUTENTICADO',
			valor: 0,
		} as Estado);
	});

	client.on('auth_failure', msg => {
		log(`[${momento()}] WSP INFO: auth_failure`, "wsp.log");
		// Fired if session restore was unsuccessful
		console.error('AUTHENTICATION FAILURE', msg);
		globalThis.estado = globalThis.estados.push({
			estado: 'ERROR DE AUTENTICACION',
			valor: 0,
		} as Estado);
	});

	client.on('message_create', msg => {

		log(`[${momento()}] WSP INFO: message_create: (${msg.to}) -> ${msg.body} `, "wsp.log");
		// Fired on all message creations, including your own
		if (msg.fromMe) {
			// do stuff here
			// console.log({ msg });
		}
	});

	client.on('message_revoke_everyone', async (after, before) => {
		log(`[${momento()}] WSP INFO: message_revoke_everyone`, "wsp.log");
		// Fired whenever a message is deleted by anyone (including you)
		console.log({ after: after.body }); // message after it was deleted.
		if (before) {
			console.log({ before: before.body }); // message before it was deleted.
		}
	});

	client.on('qr', qr => {

		log(`[${momento()}] WSP INFO: qr ${qr}`, "wsp.log");
		// Generate and scan this code with your phone
		console.log('QR RECIBIDO', qr);
		globalThis.estado = globalThis.estados.push({
			estado: 'QR',
			valor: qr,
			fecha: new Date(),
		} as Estado);

		globalThis.qrCode = qr;
	});

	client.on('ready', () => {

		log(`[${momento()}] WSP INFO: ready`, "wsp.log");
		console.log('Client is ready!');
		// Number where you want to send the message.
		// const number = '+5493516461960';

		// // Your message.
		// const text = 'Hola pollo desde Node!';

		// // Getting chatId from the number.
		// // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
		// const chatId = number.substring(1) + '@c.us';

		// // Sending message.
		// client.sendMessage(chatId, text);

		globalThis.estado = globalThis.estados.push({
			estado: 'LISTO',
			valor: 0,
		} as Estado);
	});

	client.on('message', async msg => {

		log(`[${momento()}] WSP INFO: message: (${msg.from}) -> ${msg.body}`, "wsp.log");
		if (msg.body == '!stats') {
			let mensaje = '*ESTADO:*\n';

			// const obtenerCpu = new Promise<number>((resolve, reject) => {
			// 	os.cpuUsage(cpu => {
			// 		resolve(cpu);
			// 	});
			// });
			// const cpu = await obtenerCpu;

			const cpu = await new Promise<number>((resolve, reject) => {
				os.cpuUsage(cpu => {
					resolve(cpu);
				});
			});

			mensaje += `\n*CPU:* ${(cpu * 100).toFixed(2)}%`;

			mensaje += `\n*Plataforma:* ${os.platform()}`;

			mensaje += `\n*Memoria Usada:* ${(os.totalmem() - os.freemem()).toFixed(0)}MB / ${os.totalmem().toFixed(0)}MB`;

			mensaje += `\n*% Memoria Usada:* ${(100 - os.freememPercentage() * 100).toFixed(2)}%`;

			mensaje += `\n*Cantidad de Cores:* ${os.cpuCount()}`;
			mensaje += `\n*Uptime (sys):* ${momentoSecondsToTime2(os.sysUptime().toFixed(0))}`;
			mensaje += `\n*Uptime (process):* ${momentoSecondsToTime2(os.processUptime().toFixed(0))}`;
			mensaje += `\n*Hostname:* ${hostname()}`;

			msg.reply(mensaje);
		}
		if (msg.body == '!ping') {
			msg.reply('pong');
		}
		if (msg.body == '!gordochoto') {
			msg.reply('OINK OINK');
		}
		if (msg.body == '!dolar') {


			const dolarBlueCompraS = numberToDecimalString(dolarBlueCompra, 2);
			const dolarBlueVentaS = numberToDecimalString(dolarBlueVenta, 2);

			const text = `Cotizacion del dolar (CORDOBA):

Compra: $${dolarBlueCompraS}
Venta:     *$${dolarBlueVentaS}*`;

			msg.reply(text);
		}

		// if (msg.body.startsWith('!!s')) {
		// 	const text = msg.body.split('!!s')[1];
		// 	const { data } = await axios.post('http://192.168.1.69/api/speak', { text, ip: '127.0.0.1' });
		// }

		//! CHATS
		msg.getContact().then(contact => {
			if (msg.from.slice(0, msg.from.length - 5) === 'status@broa') return;

			// console.log({ contact });
			if (msg.type === 'chat')
				console.log(
					`[[ (${contact.name}) /// (${contact.pushname})]] (${msg.from.slice(0, msg.from.length - 5)}) --->: ${msg.body
					}`
				);

			if (msg.type !== 'chat')
				console.log(
					`[[ (${contact.name}) /// (${contact.pushname})]] (${msg.from.slice(0, msg.from.length - 5)}) --->: type:${msg.type
					}`
				);
		});

		// console.log(
		// 	`Message received from ${msg.from}: ${msg.body}
		// 	\n\n-> id:${msg.id._serialized}
		// 	\n\n ${JSON.stringify(msg, null, 2)}`
		// );
	});

	client.on("change_state", (state) => {
		log(`[${momento()}] WSP INFO: change_state ${state}`, "wsp.log");
	});

	client.on("disconnected", (reason) => {
		log(`[${momento()}] WSP INFO: disconnected ${reason}`, "wsp.log");
	});

	client.on("remote_session_saved", () => {
		log(`[${momento()}] WSP INFO: remote_session_saved`, "wsp.log");
	});

	console.log("Iniciar Cliente: Creando eventos FIN");


	// INICIAR 
	console.log("Iniciar Cliente: client.initialize();");
	client.initialize();
	console.log("Iniciar Cliente: client.initialize(); FIN");

	process.on('SIGINT', async () => {
		destroyClient('SIGINT');
	});


};
