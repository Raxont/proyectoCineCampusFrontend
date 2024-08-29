const { validationResult } = require("express-validator");
const ClienteModel = require("../models/clienteModel.js");
const ClienteDTO = require("../dto/clienteDto.js");
const validator = require("validator");

/**
 * Controlador para crear un nuevo usuario.
 * Valida la solicitud, verifica el formato del correo electrónico,
 * y maneja la creación del usuario en la base de datos.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const createUser = async (req, res) => {
  const errors = validationResult(req); // Valida los datos del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
  }

  const { identificacion, nombre, nick, email, telefono, estado } = req.body;
  const clienteDto = new ClienteDTO();
  
  if (!validator.isEmail(email)) {
    return res.status(400).json(clienteDto.templateError("El correo electrónico ingresado no es válido.")); // Retorna error si el email no es válido
  }

  const clienteModel = new ClienteModel();
  try {
    await clienteModel.init(); // Inicializa el modelo de cliente
    
    // Intentar crear el usuario
    const resultado = await clienteModel.createUser({
      identificacion,
      nombre,
      nick,
      email,
      telefono,
      estado
    });

    return res.status(201).json(clienteDto.templateSuccessCreate(resultado)); // Retorna éxito en la creación del usuario
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return res.status(500).json(clienteDto.templateError("Error interno del servidor")); // Manejo de errores
  }
}

/**
 * Controlador para mostrar la información de un usuario basado en su identificación.
 * Valida la identificación proporcionada y obtiene la información del usuario.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const showInfoUser = async (req, res) => {
  const errors = validationResult(req); // Valida los datos del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
  }

  const { identificacion } = req.params;
  const clienteDto = new ClienteDTO();
  
  // Validar que la identificación es un entero y está en el rango adecuado
  const id = parseInt(identificacion, 10);
  if (isNaN(id) || id < 1000000000 || id > 9999999999) {
    return res.status(400).json(clienteDto.templateInvalidId()); // Retorna error si la identificación no es válida
  }

  const clienteModel = new ClienteModel();
  try {
    await clienteModel.init(); // Inicializa el modelo de cliente
    
    // Intentar obtener la información del usuario
    const resultado = await clienteModel.showInfoUser(id);
    
    return res.status(200).json(clienteDto.templateSuccessInfo(resultado)); // Retorna la información del usuario
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    return res.status(500).json(clienteDto.templateError("Error interno del servidor")); // Manejo de errores
  }
}

/**
 * Controlador para actualizar la información de un usuario.
 * Valida la solicitud, verifica el formato del correo electrónico y la existencia de datos,
 * y maneja la actualización del usuario en la base de datos.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const updateUser = async (req, res) => {
  const errors = validationResult(req); // Valida los datos del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
  }

  const { identificacion, estado, nick, nombre, email, telefono } = req.body;
  const clienteDto = new ClienteDTO();
  
  if (!validator.isEmail(email)) {
    return res.status(400).json(clienteDto.templateError("El correo electrónico ingresado no es válido.")); // Retorna error si el email no es válido
  }

  if (!identificacion || !nick) {
    return res.status(400).json(clienteDto.templateError("Se requiere una identificación de usuario y un nick para actualizar.")); // Retorna error si falta identificación o nick
  }

  // Validar que la identificación es un entero y está en el rango adecuado
  const id = parseInt(identificacion, 10);
  if (isNaN(id) || id < 1000000000 || id > 9999999999) {
    return res.status(400).json(clienteDto.templateInvalidId()); // Retorna error si la identificación no es válida
  }

  const clienteModel = new ClienteModel();
  try {
    await clienteModel.init(); // Inicializa el modelo de cliente
    
    // Verificar si la identificación ya existe en la base de datos
    const clienteExistentePorId = await clienteModel.showInfoUser(id);
    if (!clienteExistentePorId) {
      return res.status(404).json(clienteDto.templateError("La identificación proporcionada no existe.")); // Retorna error si la identificación no existe
    }

    // Verifica si el nick proporcionado existe en la base de datos
    const userWithNick = await clienteModel.findUserByNick(nick);
    if (!userWithNick) {
      return res.status(404).json(clienteDto.templateError("El nick proporcionado no existe en la base de datos.")); // Retorna error si el nick no existe
    }

    // Intentar actualizar el usuario
    const resultado = await clienteModel.updateInfoUser({
      identificacion: id,
      estado,
      nick,
      nombre,
      email,
      telefono
    });

    return res.status(200).json(clienteDto.templateSuccessUpdate(resultado)); // Retorna éxito en la actualización del usuario
  } catch (error) {
    console.error("Error al actualizar la información del usuario:", error);
    return res.status(500).json(clienteDto.templateError("Error interno del servidor")); // Manejo de errores
  }
}

/**
 * Controlador para obtener todos los usuarios con un rol específico.
 * Valida la solicitud y maneja la consulta de usuarios por rol.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const UsersRol = async (req, res) => {
  const errors = validationResult(req); // Valida los datos del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
  }

  const { rol } = req.params;
  const clienteDto = new ClienteDTO();
  
  const clienteModel = new ClienteModel();
  try {
    await clienteModel.init(); // Inicializa el modelo de cliente
    
    // Intentar obtener todos los usuarios con el rol especificado
    const resultado = await clienteModel.allUsersRol(rol);

    return res.status(200).json(clienteDto.templateSuccessAllUsersRol(resultado)); // Retorna los usuarios encontrados por rol
  } catch (error) {
    console.error("Error al obtener los usuarios por rol:", error);
    return res.status(500).json(clienteDto.templateError("Error interno del servidor")); // Manejo de errores
  }
}

module.exports = { createUser, showInfoUser, updateUser, UsersRol };
