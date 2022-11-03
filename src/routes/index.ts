import express from 'express';
import client from '../client.js';
import { mandarMensage, probar, putearPollo, putearCarlitos, qrImage } from '../controllers/messageController.js';

const router = express.Router();

router.post('/mandarMensaje', mandarMensage);
router.post('/probar', probar);
router.get('/putearPollo', putearPollo);
router.get('/putearCarlitos', putearCarlitos);
router.get('/qrImage', qrImage);

// router.post('/pacientes', nuevoPaciente);
// router.get('/pacientes', obtenerPacientes);
// router.get('/pacientes/:id', obtenerPaciente);
// router.put('/pacientes/:id', actualizarPaciente);
// router.delete('/pacientes/:id', eliminarPaciente);
export default router;
