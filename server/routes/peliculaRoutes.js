const express = require('express');
const router = express.Router();
const { PeliculaController } = require('../controllers/peliculaController'); // Importa el controlador para películas
const path = require("path");

// Ruta para obtener una película por ID
router.get('/getPeliculaById', (req, res) => PeliculaController(req, res));

// Ruta para servir la página principal de la aplicación
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/lugar.html"));
});

module.exports = router;
