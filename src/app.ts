import express from 'express';
import router from './routes/index.js';
import { iniciarCliente } from './client.js';
import { runCheckCitaLMDLahabana, runCheckDolar, runCheckDolarFetch, runCheckTurnosPasaporte } from './workers/workersRunner.js';


//! CONFIGURACION WHATSAPP WEB JS
iniciarCliente();

// ! CONFIGURACION CHEQUEO PAGINA DE CONSULADO (YA NO SE USA)
// setInterval(checkConsuladoPage, 10000);

//! CHEQUEO DE DOLAR
//// setInterval(checkDolarBlueCordoba, 30000);
setInterval(runCheckDolarFetch, 30000);
// runCheckDolar(undefined);

//! TURNO PASAPORTE
// setInterval(runCheckTurnosPasaporte, 60000 * 3); //chequea cada 3 minutos

//estos de abajo son los que van
// setInterval(() => runCheckTurnosPasaporte('8089'), 60000 * 3); //Chequea cada 3 minutos 
// setTimeout(() => {
// 	setInterval(() => runCheckTurnosPasaporte('8091'), 60000 * 3); //Chequea cada 3 minutos empezando 1.5 minutos despues
// }, 60000 * 1.5);

//! TURNO LA HABANA
// //setInterval(runCheckCitaLMDLahabana, 60000 * 3); //Chequea cada 3 minutos
// // runCheckCitaLMDLahabana('8089');
// // runCheckCitaLMDLahabana('8091');

// // Inicio el chequeo cada 3 minutos
// setInterval(() => runCheckCitaLMDLahabana('8089'), 60000 * 3); //Chequea cada 3 minutos 

// // Espero un minuto para iniciar cada 3 minutos el otro
// setTimeout(() => {
// 	setInterval(() => runCheckCitaLMDLahabana('8091'), 60000 * 3); //Chequea cada 3 minutos
// }, 60000 * 1.5);


//! CONFIGURACION EXPRESS
const app = express();

app.use(express.json()); //! Este codigo es clave para que haga la conversion a JSON sino no llega
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
	console.log(`Servidor Funcionando en: 🚀 @ http://localhost:${PORT}`);
});
