import { Client, LocalAuth } from 'whatsapp-web.js';
// // const { Client } = require('whatsapp-web.js');

const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		handleSIGINT: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	},

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

client.on('qr', qr => {
	// Generate and scan this code with your phone
	console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
	console.log('Client is ready!');
	// Number where you want to send the message.
	const number = '+5493516461960';

	// Your message.
	const text = 'Hola pollo desde Node!';

	// Getting chatId from the number.
	// we have to delete "+" from the beginning and add "@c.us" at the end of the number.
	const chatId = number.substring(1) + '@c.us';

	// Sending message.
	client.sendMessage(chatId, text);
});

client.on('message', msg => {
	if (msg.body == '!ping') {
		msg.reply('pong');
	}
	// console.log({ msg });
	console.log(`${msg.author} (${msg.from}): ${msg.body}`);
});

// mandarMensaje();

client.initialize();

export default client;
