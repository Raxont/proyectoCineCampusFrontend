const express = require('express');
const router = express.Router();
const { TarjetaRequest, createTarjeta, renderTarjeta } = require('../controllers/tarjetaController');
const path = require("path")

//! Ruta para obtener boletas por cliente y mostrar el archivo HTML correspondiente
router.get('/verBoleta', (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/tarjeta.html"));
});

//! Ruta para obtener el descuento relacionado con una tarjeta
router.post('/getDescuento', (req, res) => TarjetaRequest(req, res));

//! Ruta para crear una nueva tarjeta
router.post('/createTarjeta', (req, res) => createTarjeta(req, res));

//! Ruta de prueba para verificar que la API de tarjeta está funcionando
router.get("/", (req, res) => {
    res.send("API de tarjeta funcionando correctamente.");
});

module.exports = router;
