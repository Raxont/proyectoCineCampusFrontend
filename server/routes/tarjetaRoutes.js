const express = require('express');
const router = express.Router();
const {TarjetaRequest, createTarjeta,renderTarjeta} = require('../controllers/tarjetaController');
const path = require("path")

// Ruta para obtener boletas por cliente y mostrar HTML
router.get('/verBoleta', (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/tarjeta.html"));
});

router.post('/getDescuento', (req, res) => TarjetaRequest(req, res));
router.post('/createTarjeta', (req, res) => createTarjeta(req, res));

router.get("/", (req, res) => {
    res.send("API de tarjeta funcionando correctamente.");
  });

module.exports = router;