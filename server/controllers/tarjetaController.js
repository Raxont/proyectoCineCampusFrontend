const { validationResult } = require("express-validator");
const TarjetaModel = require("../models/tarjetaModel.js");
const TarjetaDTO = require("../dto/tarjetaDto.js");
const BoletaModel = require("../models/boletaModel");
const { ObjectId } = require("mongodb");

const TarjetaRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { idboleta, identificacionCliente } = req.body;

  // Validar el ObjectId del lugar
  if (!ObjectId.isValid(idboleta)) {
    return res.status(400).json(tarjetaDto.templateInvalidId());
  }
  
  const tarjetaModel = new TarjetaModel();
  const tarjetaDto = new TarjetaDTO();
  try {
    await tarjetaModel.init()
    identificacionCliente = Number(identificacionCliente);
    // Verificar si el cliente tiene una tarjeta activa
    const tarjeta = await tarjetaModel.findTarjetaByClient(identificacionCliente);
    if (!tarjeta) {
      return res.status(404).json(tarjetaDto.templateTarjetaNotFound());
    }
    
    // Obtener el lugar relacionado con el ID proporcionado
    const boleta = await tarjetaModel.findBoletaById(idboleta);

    if (!boleta) {
      return res.status(404).json(tarjetaDto.templateBoletaNotFound());
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
    return res.status(500).json(tarjetaDto.templateError("Error interno del servidor"));
  }
}

const createTarjeta = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { identificacionCliente, numero, fecha_expedicion, estado } = req.body;

  const tarjetaData = {
    numero,
    identificacion_cliente: identificacionCliente,
    fecha_expedicion: new Date(fecha_expedicion),
    estado
  };

  try {
    const tarjetaModel = new TarjetaModel();
    const tarjetaDto = new TarjetaDTO();
    // Verificar si el cliente es usuarioVIP
    const clienteVip = await tarjetaModel.findClienteVip(identificacionCliente);

    if (!clienteVip) {
      return res.status(400).json(tarjetaDto.templateNotVip());
    }

    // Intentar crear la tarjeta
    const resultado = await tarjetaModel.insertTarjeta(tarjetaData);

    return res.status(201).json(tarjetaDto.templateTarjetaCreada(resultado));
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
    return res.status(500).json(tarjetaDto.templateError("Error interno del servidor"));
  }
}

// Nueva función para manejar la vista HTML
const renderTarjeta = async (req, res) => {
  try {
    const { identificacionCliente } = req.query;
    const boletaModel = new BoletaModel();

    const boleta = await boletaModel.getBoletasByCliente(identificacionCliente);

    if (boleta.length === 0) {
      return res.status(404).send('Boleta no encontrada');
    }

    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/tarjeta.html"));
  } catch (error) {
    console.error("Error al renderizar la boleta:", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = { TarjetaRequest, createTarjeta, renderTarjeta };
