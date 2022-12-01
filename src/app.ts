import express from 'express';
import router from './routes/index.js';
import { iniciarCliente } from './client.js';
import { runCheckDolar, runCheckTurnosPasaporte } from './workers/workersRunner.js';

//! CONFIGURACION WHATSAPP WEB JS
iniciarCliente();

// ! CONFIGURACION CHEQUEO PAGINA DE CONSULADO
// setInterval(checkConsuladoPage, 10000);

//! CONFIGURACION CHEQUEO DE DOLAR
//// setInterval(checkDolarBlueCordoba, 30000);
setInterval(runCheckDolar, 30000);
setInterval(runCheckTurnosPasaporte, 60000 *3);

//! CONFIGURACION EXPRESS
const app = express();

app.use(express.json()); //! Este codigo es clave para que haga la conversion a JSON sino no llega
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
	console.log(`Servidor Funcionando en: 🚀 @ http://localhost:${PORT}`);
});
