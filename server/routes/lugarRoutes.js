const express = require('express');
const router = express.Router();
const LugarController = require('../controllers/lugarController');

// Ruta para obtener todos los lugares por fecha
router.get('/lugaresPorFecha', (req, res) => LugarController(req, res));

// Ruta para obtener lugares por película específica
router.get('/lugaresPorPelicula', (req, res) => LugarController(req, res));

// Ruta para verificar la API
router.get('/', (req, res) => {
    res.send('Bienvenido a la sección de funciones');
});

module.exports = router;