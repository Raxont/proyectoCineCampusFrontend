const express = require('express');
const router = express.Router();
const {AsientoController,renderasiento} = require('../controllers/asientoController');
const path = require("path")

// Ruta para realizar la reserva
router.post('/getReserva', (req, res) => AsientoController(req, res));

// Ruta para cancelar la reserva
router.post('/returnReserva', (req, res) => AsientoController(req, res));

router.get('/asientosDisponibles', (req, res) => AsientoController(req, res));

router.get('/getAsientos', (req, res) => AsientoController(req, res));

// Ruta para obtener los lugares por pelicula y fecha inicio, y mostrar HTML
router.get('/verAsiento', (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/asiento.html"));
});

// Ruta para verificar la API
router.get("/", (req, res) => {
    res.send("API de Asiento funcionando correctamente.");
  });

module.exports = router;
