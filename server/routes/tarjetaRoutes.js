const express = require('express');
const router = express.Router();
const {TarjetaRequest, createTarjeta} = require('../controllers/tarjetaController');

router.post('/getDescuento', (req, res) => TarjetaRequest(req, res));
router.post('/createTarjeta', (req, res) => createTarjeta(req, res));

router.get('/', (req, res) => {
    res.send('Bienvenido a la sección de tarjetas');
});

module.exports = router;