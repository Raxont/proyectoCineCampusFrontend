const express = require('express');
const router = express.Router();
const BoletaController = require('../controllers/boletaController');

// Ruta para obtener todas las boletas
router.get('/getAllBoletas', (req, res) => BoletaController(req, res));

// Ruta para obtener boletas por cliente
router.get('/boletasPorCliente', (req, res) => BoletaController(req, res));

// Ruta para obtener asientos disponibles en un lugar específico
router.get('/asientosDisponibles', (req, res) => BoletaController(req, res));

// Ruta para agregar una nueva boleta
router.post('/agregarBoleta', (req, res) => BoletaController(req, res));

// Ruta para actualizar una boleta existente
router.put('/actualizarBoleta/:idBoleta', (req, res) => BoletaController(req, res));

// Ruta para eliminar una boleta
router.delete('/eliminarBoleta', (req, res) => BoletaController(req, res));

// Ruta para verificar la API
router.get('/', (req, res) => {
    res.send('Bienvenido a la sección de boletas');
});

module.exports = router;
