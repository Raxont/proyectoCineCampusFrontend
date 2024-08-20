const { validationResult } = require("express-validator");
const ClienteModel = require("../models/clienteModel.js");
const ClienteDTO = require("../dto/clienteDto.js");
const validator = require("validator");

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { identificacion, nombre, nick, email, telefono, estado } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json(clienteDto.templateError("El correo electrónico ingresado no es válido."));
  }
  const clienteModel = new ClienteModel();
  const clienteDto = new ClienteDTO();
  try {
    
    // Intentar crear el usuario
    const resultado = await clienteModel.createUser({
      identificacion,
      nombre,
      nick,
      email,
      telefono,
      estado
    });
    return res.status(201).json(clienteDto.templateSuccessCreate(resultado));
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return res.status(500).json(clienteDto.templateError("Error interno del servidor"));
  }
}

const showInfoUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { identificacion } = req.params;

  // Validar que la identificación es un entero
  const id = parseInt(identificacion, 10);
  if (isNaN(id) || id < 1000000000 || id > 9999999999) {
    return res.status(400).json(clienteDto.templateInvalidId());
  }

  try {
    const clienteModel = new ClienteModel();
    const clienteDto = new ClienteDTO();
    // Intentar obtener la información del usuario
    const resultado = await clienteModel.showInfoUser(id);

    return res.status(200).json(clienteDto.templateSuccessInfo(resultado));
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    return res.status(500).json(clienteDto.templateError("Error interno del servidor"));
  }
}

const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { identificacion, estado, nick, nombre, email, telefono } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json(clienteDto.templateError("El correo electrónico ingresado no es válido."));
  }

  if (!identificacion || !nick) {
    return res.status(400).json(clienteDto.templateError("Se requiere una identificación de usuario y un nick para actualizar."));
  }

  // Validar que la identificación es un entero
  const id = parseInt(identificacion, 10);
  if (isNaN(id) || id < 1000000000 || id > 9999999999) {
    return res.status(400).json(clienteDto.templateInvalidId());
  }

  // Verificar si la identificación ya existe en la base de datos
  const clienteExistentePorId = await clienteModel.showInfoUser(identificacion);
  if (!clienteExistentePorId) {
    return res.status(404).json(clienteDto.templateError("La identificación proporcionada no existe."));
  }

  // Verifica si el nick proporcionado existe en la base de datos
  const userWithNick = await clienteModel.findUserByNick(nick);
  if (!userWithNick) {
    return res.status(404).json(clienteDto.templateError("El nick proporcionado no existe en la base de datos."));
  }

  try {
    const clienteModel = new ClienteModel();
    const clienteDto = new ClienteDTO();
    // Intentar actualizar el usuario
    const resultado = await clienteModel.updateInfoUser({
      identificacion: id,
      estado,
      nick,
      nombre,
      email,
      telefono
    });

    return res.status(200).json(clienteDto.templateSuccessUpdate(resultado));
  } catch (error) {
    console.error("Error al actualizar la información del usuario:", error);
    return res.status(500).json(clienteDto.templateError("Error interno del servidor"));
  }
}

const UsersRol = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rol } = req.params;

  try {
    const clienteModel = new ClienteModel();
    const clienteDto = new ClienteDTO();
    // Intentar obtener todos los usuarios con el rol especificado
    const resultado = await clienteModel.allUsersRol(rol);

    return res.status(200).json(clienteDto.templateSuccessAllUsersRol(resultado));
  } catch (error) {
    console.error("Error al obtener los usuarios por rol:", error);
    return res.status(500).json(clienteDto.templateError("Error interno del servidor"));
  }
}


module.exports = { createUser, showInfoUser, updateUser, UsersRol };
