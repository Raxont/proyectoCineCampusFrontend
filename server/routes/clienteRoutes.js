const express = require('express');
const router = express.Router();
const {createUser, showInfoUser, updateUser, UsersRol} = require('../controllers/clienteController');
const path = require("path")

// Ruta para crear un nuevo cliente
router.post('/crear', (req, res) => createUser(req, res));

// Ruta para obtener la información de un cliente por identificación
router.get('/info/:identificacion', (req, res) => showInfoUser(req, res));

// Ruta para actualizar la información de un cliente
router.put('/actualizar', (req, res) => updateUser(req, res));

// Ruta para obtener todos los clientes con un rol específico
router.get('/rol/:rol', (req, res) => UsersRol(req, res));

// Ruta principal para clientes
router.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "../../",process.env.STATIC,"views/cliente.html"));
})
router.get("/sin", (req,res)=>{
    res.sendFile(path.join(__dirname, "../../",process.env.STATIC,"views/sincliente.html"));
})


module.exports = router;