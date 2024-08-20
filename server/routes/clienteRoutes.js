const express = require('express');
const router = express.Router();
const {createUser, showInfoUser, updateUser, UsersRol} = require('../controllers/clienteController');

// Ruta para crear un nuevo cliente
router.post('/crear', (req, res) => createUser(req, res));

// Ruta para obtener la información de un cliente por identificación
router.get('/info/:identificacion', (req, res) => showInfoUser(req, res));

// Ruta para actualizar la información de un cliente
router.put('/actualizar', (req, res) => updateUser(req, res));

// Ruta para obtener todos los clientes con un rol específico
router.get('/rol/:rol', (req, res) => UsersRol(req, res));

// Ruta principal para clientes
router.get('/', (req, res) => {
    res.send('Bienvenido a la sección de clientes');
});

module.exports = router;