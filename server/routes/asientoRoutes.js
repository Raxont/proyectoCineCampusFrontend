const express = require('express');
const router = express.Router();
const AsientoController = require('../controllers/asientoController');
const path = require("path")

// Ruta para realizar la reserva
router.post('/getReserva', (req, res) => AsientoController(req, res));

// Ruta para cancelar la reserva
router.post('/returnReserva', (req, res) => AsientoController(req, res));

// Ruta para verificar la API
router.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "../../",process.env.STATIC,"views/asiento.html"));
})

module.exports = router;
