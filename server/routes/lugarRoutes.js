const express = require('express');
const router = express.Router();
const LugarController = require('../controllers/lugarController');
const PeliculaController = require('../controllers/peliculaController'); // Importa el controlador para películas
const path = require("path")

// Ruta para obtener todos los lugares por fecha
router.get('/lugaresPorFecha', (req, res) => LugarController(req, res));

// Ruta para obtener un lugar en especifico
router.get('/getInfoLugar', (req, res) => LugarController(req, res));

// Ruta para obtener lugares por película específica
router.get('/lugaresPorPelicula', (req, res) => LugarController(req, res));

router.get('/peliculas', (req, res) => PeliculaController.PeliculaRequest(req, res));

router.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "../../",process.env.STATIC,"views/lugar.html"));
})

module.exports = router;