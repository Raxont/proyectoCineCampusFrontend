const express = require('express');
const router = express.Router();
const TarjetaController = require('../controllers/tarjetaController');

const tarjetaController = new TarjetaController();

router.post('/getDescuento', (req, res) => tarjetaController.TarjetaRequest(req, res));
router.post('/createTarjeta', (req, res) => tarjetaController.createTarjeta(req, res));

router.get('/', (req, res) => {
    res.send('Bienvenido a la sección de tarjetas');
});

module.exports = router;