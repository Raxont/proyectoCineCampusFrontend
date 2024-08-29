const { validationResult } = require("express-validator");
const TarjetaModel = require("../models/tarjetaModel.js");
const TarjetaDTO = require("../dto/tarjetaDto.js");
const BoletaModel = require("../models/boletaModel");
const { ObjectId } = require("mongodb");

/**
 * Controlador para procesar una solicitud de tarjeta.
 * Valida los datos de la solicitud, verifica la existencia de la tarjeta activa,
 * obtiene la boleta asociada y calcula el precio con descuento si aplica.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const TarjetaRequest = async (req, res) => {
  const errors = validationResult(req); // Valida los datos del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
  }

  let { idboleta, identificacionCliente } = req.body;

  // Validar el ObjectId del lugar
  if (!ObjectId.isValid(idboleta)) {
    return res.status(400).json(tarjetaDto.templateInvalidId()); // Retorna error si el ID de boleta es inválido
  }
  
  const tarjetaModel = new TarjetaModel();
  const tarjetaDto = new TarjetaDTO();
  try {
    await tarjetaModel.init(); // Inicializa el modelo de tarjeta
    identificacionCliente = Number(identificacionCliente); // Convierte la identificación del cliente a número

    // Verificar si el cliente tiene una tarjeta activa
    const tarjeta = await tarjetaModel.findTarjetaByClient(identificacionCliente);
    if (!tarjeta) {
      return res.status(404).json(tarjetaDto.templateTarjetaNotFound()); // Retorna error si la tarjeta no se encuentra
    }
    
    // Obtener el lugar relacionado con el ID proporcionado
    const boleta = await tarjetaModel.findBoletaById(idboleta);
    if (!boleta) {
      return res.status(404).json(tarjetaDto.templateBoletaNotFound()); // Retorna error si la boleta no se encuentra
    }

    // Calcular el precio con descuento si aplica
    const { precioOriginal, precioConDescuento } = tarjetaModel.calculateDiscount(tarjeta, boleta);

    // Actualizar el precio en la boleta asociada al cliente
    const resultadoBoleta = await tarjetaModel.updateBoletaPrice(identificacionCliente, precioConDescuento);

    return res.status(200).json(tarjetaDto.templateSuccess({
      precioOriginal,
      precioConDescuento,
      resultadoBoleta
    }));

  } catch (error) {
    console.error("Error en el controlador de tarjetas:", error);
    return res.status(500).json(tarjetaDto.templateError("Error interno del servidor")); // Manejo de errores
  }
}

/**
 * Controlador para crear una nueva tarjeta.
 * Valida los datos de la solicitud, verifica si el cliente es VIP,
 * y crea la tarjeta si el cliente es válido.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const createTarjeta = async (req, res) => {
  const errors = validationResult(req); // Valida los datos del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
  }
  const { identificacionCliente, numero, fecha_expedicion, estado } = req.body;

  const tarjetaData = {
    numero,
    identificacion_cliente: identificacionCliente,
    fecha_expedicion: new Date(fecha_expedicion), // Convierte la fecha de expedición a objeto Date
    estado
  };

  const tarjetaModel = new TarjetaModel();
  const tarjetaDto = new TarjetaDTO();
  try {
    await tarjetaModel.init(); // Inicializa el modelo de tarjeta

    // Verificar si el cliente es usuario VIP
    const clienteVip = await tarjetaModel.findClienteVip(identificacionCliente);
    if (!clienteVip) {
      return res.status(400).json(tarjetaDto.templateNotVip()); // Retorna error si el cliente no es VIP
    }

    // Intentar crear la tarjeta
    const resultado = await tarjetaModel.insertTarjeta(tarjetaData);

    return res.status(201).json(tarjetaDto.templateTarjetaCreada(resultado)); // Retorna éxito al crear la tarjeta
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
    return res.status(500).json(tarjetaDto.templateError("Error interno del servidor")); // Manejo de errores
  }
}

/**
 * Controlador para renderizar una vista HTML de la tarjeta.
 * Obtiene la boleta asociada al cliente y envía el archivo HTML de la vista.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const renderTarjeta = async (req, res) => {
  const boletaModel = new BoletaModel();
  try {
    await tarjetaModel.init(); // Inicializa el modelo de tarjeta
    const { identificacionCliente } = req.query; // Obtiene la identificación del cliente de los parámetros de consulta

    // Obtiene las boletas asociadas al cliente
    const boleta = await boletaModel.getBoletasByCliente(identificacionCliente);
    if (boleta.length === 0) {
      return res.status(404).send('Boleta no encontrada'); // Retorna error si no se encuentra la boleta
    }

    // Envía el archivo HTML de la vista
    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/tarjeta.html"));
  } catch (error) {
    console.error("Error al renderizar la boleta:", error);
    res.status(500).send("Error interno del servidor"); // Manejo de errores
  }
};

module.exports = { TarjetaRequest, createTarjeta, renderTarjeta };
