const express = require('express');
const router = express.Router();
const { PeliculaController } = require('../controllers/peliculaController'); // Importa el controlador para películas
const path = require("path");

//! Ruta para obtener una película por ID
// Procesa las solicitudes GET en '/getPeliculaById' utilizando el controlador de películas
router.get('/getPeliculaById', (req, res) => PeliculaController(req, res));

//! Ruta para servir la página principal de la aplicación
// Envía el archivo HTML para la vista principal cuando se accede a la ruta raíz
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/lugar.html"));
});

module.exports = router;
