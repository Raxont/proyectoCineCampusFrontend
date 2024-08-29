const express = require('express');
const router = express.Router();
const LugarController = require('../controllers/lugarController');
const PeliculaController = require('../controllers/peliculaController'); // Importa el controlador para películas
const path = require("path");

//! Ruta para obtener todos los lugares disponibles por fecha
// Procesa las solicitudes GET en '/lugaresPorFecha' utilizando el controlador de lugares
router.get('/lugaresPorFecha', (req, res) => LugarController(req, res));

//! Ruta para obtener información de un lugar específico
// Procesa las solicitudes GET en '/getInfoLugar' utilizando el controlador de lugares
router.get('/getInfoLugar', (req, res) => LugarController(req, res));

//! Ruta para obtener lugares disponibles para una película específica
// Procesa las solicitudes GET en '/lugaresPorPelicula' utilizando el controlador de lugares
router.get('/lugaresPorPelicula', (req, res) => LugarController(req, res));

//! Ruta para obtener películas utilizando el método PeliculaRequest del controlador de películas
router.get('/peliculas', (req, res) => PeliculaController.PeliculaRequest(req, res));

//! Ruta para servir la página principal de lugares
// Envía el archivo HTML para la vista principal cuando se accede a la ruta raíz
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/lugar.html"));
});

module.exports = router;
