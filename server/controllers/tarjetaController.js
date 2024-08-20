const { validationResult } = require("express-validator");
const TarjetaModel = require("../models/tarjetaModel.js");
const TarjetaDTO = require("../dto/tarjetaDto.js");
const { ObjectId } = require("mongodb");

const TarjetaRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { idLugar, identificacionCliente } = req.body;

  // Validar el ObjectId del lugar
  if (!ObjectId.isValid(idLugar)) {
    return res.status(400).json(tarjetaDto.templateInvalidId());
  }

  const objectIdLugar = new ObjectId(idLugar);
  const tarjetaModel = new TarjetaModel();
  const tarjetaDto = new TarjetaDTO();
  try {
    
    // Verificar si el cliente tiene una tarjeta activa
    const tarjeta = await tarjetaModel.findTarjetaByClient(identificacionCliente);

    if (!tarjeta) {
      return res.status(404).json(tarjetaDto.templateTarjetaNotFound());
    }

    // Obtener el lugar relacionado con el ID proporcionado
    const lugar = await tarjetaModel.findLugarById(objectIdLugar);

    if (!lugar) {
      return res.status(404).json(tarjetaDto.templateLugarNotFound());
    }

    // Calcular el precio con descuento si aplica
    const { precioOriginal, precioConDescuento } = tarjetaModel.calculateDiscount(tarjeta, lugar);

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



module.exports = { TarjetaRequest, createTarjeta };
