const express = require('express');
const router = express.Router();
const AsientoController = require('../controllers/asientoController');

const asientoController = new AsientoController();

// Ruta para realizar la reserva
router.post('/getReserva', (req, res) => asientoController.handleRequest(req, res));

// Ruta para cancelar la reserva
router.post('/returnReserva', (req, res) => asientoController.handleRequest(req, res));

// Ruta para verificar la API
router.get('/', (req, res) => {
    res.send('Kevin la chupa');
});

module.exports = router;
