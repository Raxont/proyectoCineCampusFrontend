const express = require('express');
const router = express.Router();
const { BoletaAPIController, renderBoleta } = require('../controllers/boletaController');
const path = require("path");

// Ruta para obtener todas las boletas
router.get('/getAllBoletas', (req, res) => BoletaAPIController(req, res));

// Ruta para obtener boletas por cliente y mostrar HTML
router.get('/verBoleta', (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/boleta.html"));
});

// Ruta para obtener boletas por cliente en JSON
router.get('/boletasPorCliente', (req, res) => BoletaAPIController(req, res));

// Ruta para obtener boletas por cliente y id lugar en JSON
router.get('/getBoletasByClienteAndLugar', (req, res) => BoletaAPIController(req, res));

// Otras rutas de la API
router.post('/agregarBoleta', (req, res) => BoletaAPIController(req, res));
router.put('/actualizarBoleta/:idBoleta', (req, res) => BoletaAPIController(req, res));
router.delete('/eliminarBoleta', (req, res) => BoletaAPIController(req, res));

// Ruta para verificar la API
router.get("/", (req, res) => {
  res.send("API de Boletas funcionando correctamente.");
});

module.exports = router;
