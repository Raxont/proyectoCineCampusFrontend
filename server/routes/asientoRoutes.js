const express = require('express');
const router = express.Router();
const AsientoController = require('../controllers/asientoController');

// Ruta para realizar la reserva
router.post('/getReserva', (req, res) => AsientoController(req, res));

// Ruta para cancelar la reserva
router.post('/returnReserva', (req, res) => AsientoController(req, res));

// Ruta para verificar la API
router.get('/', (req, res) => {
    res.send('Bienvenido a la seccion de asientos');
});

module.exports = router;
