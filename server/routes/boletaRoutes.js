const express = require('express');
const router = express.Router();
const { BoletaAPIController, renderBoleta } = require('../controllers/boletaController');
const path = require("path");

//! Ruta para obtener todas las boletas
// Procesa las solicitudes GET en '/getAllBoletas' utilizando el controlador de boletas
router.get('/getAllBoletas', (req, res) => BoletaAPIController(req, res));

//! Ruta para obtener boletas por cliente y servir el archivo HTML correspondiente
// Envía el archivo HTML para la vista de boletas cuando se accede a '/verBoleta'
router.get('/verBoleta', (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/boleta.html"));
});

//! Ruta para obtener boletas por cliente en formato JSON
// Procesa las solicitudes GET en '/boletasPorCliente' utilizando el controlador de boletas
router.get('/boletasPorCliente', (req, res) => BoletaAPIController(req, res));

//! Ruta para obtener boletas por cliente y lugar en formato JSON
// Procesa las solicitudes GET en '/getBoletasByClienteAndLugar' utilizando el controlador de boletas
router.get('/getBoletasByClienteAndLugar', (req, res) => BoletaAPIController(req, res));

//! Rutas para manejar la creación, actualización y eliminación de boletas
// Procesa las solicitudes POST en '/agregarBoleta' utilizando el controlador de boletas para agregar una nueva boleta
router.post('/agregarBoleta', (req, res) => BoletaAPIController(req, res));

// Procesa las solicitudes PUT en '/actualizarBoleta/:idBoleta' utilizando el controlador de boletas para actualizar una boleta existente
router.put('/actualizarBoleta/:idBoleta', (req, res) => BoletaAPIController(req, res));

// Procesa las solicitudes DELETE en '/eliminarBoleta' utilizando el controlador de boletas para eliminar una boleta
router.delete('/eliminarBoleta', (req, res) => BoletaAPIController(req, res));

//! Ruta para verificar que la API de boletas está funcionando
// Envía un mensaje de confirmación cuando se accede a la ruta raíz
router.get("/", (req, res) => {
  res.send("API de Boletas funcionando correctamente.");
});

module.exports = router;
