import express from 'express';
import router from './routes/index.js';
import { checkPage } from './helpers/checkPage.js';
import { iniciarCliente } from './client.js';

//! CONFIGURACION WHATSAPP WEB JS
iniciarCliente();

//! CONFIGURACION CHEQUEO PAGINA
setInterval(checkPage, 10000);

//! CONFIGURACION EXPRESS
const app = express();

app.use(express.json()); //! Este codigo es clave para que haga la conversion a JSON sino no llega
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
	console.log(`Servidor Funcionando en: 🚀 @ http://localhost:${PORT}`);
});
