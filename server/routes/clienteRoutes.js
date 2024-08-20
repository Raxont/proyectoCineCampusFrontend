const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');

const clienteController = new ClienteController();

// Ruta para crear un nuevo cliente
router.post('/crear', (req, res) => clienteController.createUser(req, res));

// Ruta para obtener la información de un cliente por identificación
router.get('/info/:identificacion', (req, res) => clienteController.showInfoUser(req, res));

// Ruta para actualizar la información de un cliente
router.put('/actualizar', (req, res) => clienteController.updateUser(req, res));

// Ruta para obtener todos los clientes con un rol específico
router.get('/rol/:rol', (req, res) => clienteController.UsersRol(req, res));

// Ruta principal para clientes
router.get('/', (req, res) => {
    res.send('Bienvenido a la sección de clientes');
});

module.exports = router;