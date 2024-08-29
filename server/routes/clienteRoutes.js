const express = require('express');
const router = express.Router();
const { createUser, showInfoUser, updateUser, UsersRol } = require('../controllers/clienteController');
const path = require("path");

//! Ruta para crear un nuevo cliente
// Procesa las solicitudes POST en '/crear' utilizando el controlador para crear un nuevo cliente
router.post('/crear', (req, res) => createUser(req, res));

//! Ruta para obtener la información de un cliente por identificación
// Procesa las solicitudes GET en '/info/:identificacion' utilizando el controlador para mostrar la información del cliente
router.get('/info/:identificacion', (req, res) => showInfoUser(req, res));

//! Ruta para actualizar la información de un cliente
// Procesa las solicitudes PUT en '/actualizar' utilizando el controlador para actualizar la información del cliente
router.put('/actualizar', (req, res) => updateUser(req, res));

//! Ruta para obtener todos los clientes con un rol específico
// Procesa las solicitudes GET en '/rol/:rol' utilizando el controlador para obtener clientes por rol
router.get('/rol/:rol', (req, res) => UsersRol(req, res));

//! Ruta principal para clientes
// Envía el archivo HTML para la vista principal de clientes cuando se accede a la ruta raíz
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/cliente.html"));
});

//! Ruta para mostrar una página alternativa cuando no se encuentra cliente
// Envía el archivo HTML para la vista alternativa cuando se accede a '/sin'
router.get("/sin", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/sincliente.html"));
});

module.exports = router;
