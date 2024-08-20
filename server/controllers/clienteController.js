const { validationResult } = require("express-validator");
const ClienteModel = require("../models/clienteModel.js");
const ClienteDTO = require("../dto/clienteDto.js");
const validator = require("validator"); 

class ClienteController {
  constructor() {
    this.clienteModel = new ClienteModel();
    this.clienteDto = new ClienteDTO();
  }

  async createUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identificacion, nombre, nick, email, telefono, estado } = req.body;
    
    if (!validator.isEmail(email)) {
        return res.status(400).json(this.clienteDto.templateError("El correo electrónico ingresado no es válido."));
    }

    try {
      // Intentar crear el usuario
      const resultado = await this.clienteModel.createUser({
        identificacion,
        nombre,
        nick,
        email,
        telefono,
        estado
      });
      return res.status(201).json(this.clienteDto.templateSuccessCreate(resultado));
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return res.status(500).json(this.clienteDto.templateError("Error interno del servidor"));
    }
  }

  async showInfoUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identificacion } = req.params;

    // Validar que la identificación es un entero
    const id = parseInt(identificacion, 10);
    if (isNaN(id) || id < 1000000000 || id > 9999999999) {
      return res.status(400).json(this.clienteDto.templateInvalidId());
    }

    try {
      // Intentar obtener la información del usuario
      const resultado = await this.clienteModel.showInfoUser(id);

      return res.status(200).json(this.clienteDto.templateSuccessInfo(resultado));
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
      return res.status(500).json(this.clienteDto.templateError("Error interno del servidor"));
    }
  }

  async updateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identificacion, estado, nick, nombre, email, telefono} = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json(this.clienteDto.templateError("El correo electrónico ingresado no es válido."));
    }

    if (!identificacion || !nick) {
        return res.status(400).json(this.clienteDto.templateError("Se requiere una identificación de usuario y un nick para actualizar."));
    }

    // Validar que la identificación es un entero
    const id = parseInt(identificacion, 10);
    if (isNaN(id) || id < 1000000000 || id > 9999999999) {
      return res.status(400).json(this.clienteDto.templateInvalidId());
    }

      // Verificar si la identificación ya existe en la base de datos
      const clienteExistentePorId = await this.clienteModel.showInfoUser(identificacion);
      if (!clienteExistentePorId) {
          return res.status(404).json(this.clienteDto.templateError("La identificación proporcionada no existe."));
      }

      // Verifica si el nick proporcionado existe en la base de datos
      const userWithNick = await this.clienteModel.findUserByNick(nick);
      if (!userWithNick) {
          return res.status(404).json(this.clienteDto.templateError("El nick proporcionado no existe en la base de datos."));
      }
    
    try {
      // Intentar actualizar el usuario
      const resultado = await this.clienteModel.updateInfoUser({
        identificacion: id,
        estado,
        nick,
        nombre,
        email,
        telefono
      });

      return res.status(200).json(this.clienteDto.templateSuccessUpdate(resultado));
    } catch (error) {
      console.error("Error al actualizar la información del usuario:", error);
      return res.status(500).json(this.clienteDto.templateError("Error interno del servidor"));
    }
  }

  async UsersRol(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rol } = req.params;

    try {
      // Intentar obtener todos los usuarios con el rol especificado
      const resultado = await this.clienteModel.allUsersRol(rol);

      return res.status(200).json(this.clienteDto.templateSuccessAllUsersRol(resultado));
    } catch (error) {
      console.error("Error al obtener los usuarios por rol:", error);
      return res.status(500).json(this.clienteDto.templateError("Error interno del servidor"));
    }
  }
}

module.exports = ClienteController;
