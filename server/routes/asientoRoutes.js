const express = require('express');
const router = express.Router();
const { AsientoController, renderasiento } = require('../controllers/asientoController');
const path = require("path");

//! Ruta para realizar la reserva
// Procesa las solicitudes POST en '/getReserva' utilizando el controlador de asientos para realizar una reserva
router.post('/getReserva', (req, res) => AsientoController(req, res));

//! Ruta para cancelar la reserva
// Procesa las solicitudes POST en '/returnReserva' utilizando el controlador de asientos para cancelar una reserva
router.post('/returnReserva', (req, res) => AsientoController(req, res));

//! Ruta para obtener los asientos disponibles
// Procesa las solicitudes GET en '/asientosDisponibles' utilizando el controlador de asientos para obtener la disponibilidad
router.get('/asientosDisponibles', (req, res) => AsientoController(req, res));

//! Ruta para obtener todos los asientos
// Procesa las solicitudes GET en '/getAsientos' utilizando el controlador de asientos para obtener todos los asientos
router.get('/getAsientos', (req, res) => AsientoController(req, res));

//! Ruta para servir la página de asientos en formato HTML
// Envía el archivo HTML para la vista de asientos cuando se accede a '/verAsiento'
router.get('/verAsiento', (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/asiento.html"));
});

//! Ruta para verificar que la API de asientos está funcionando
// Envía un mensaje de confirmación cuando se accede a la ruta raíz
router.get("/", (req, res) => {
    res.send("API de Asiento funcionando correctamente.");
});

module.exports = router;
