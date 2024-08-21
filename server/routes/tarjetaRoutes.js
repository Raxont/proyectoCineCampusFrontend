const express = require('express');
const router = express.Router();
const {TarjetaRequest, createTarjeta} = require('../controllers/tarjetaController');
const path = require("path")

router.post('/getDescuento', (req, res) => TarjetaRequest(req, res));
router.post('/createTarjeta', (req, res) => createTarjeta(req, res));

router.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "../../",process.env.STATIC,"views/tarjeta.html"));
})

module.exports = router;