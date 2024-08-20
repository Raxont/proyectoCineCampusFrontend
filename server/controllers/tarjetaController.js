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
    return res.status(400).json(this.tarjetaDto.templateInvalidId());
  }

  const objectIdLugar = new ObjectId(idLugar);

  try {
    const tarjetaModel = new TarjetaModel();
    const tarjetaDto = new TarjetaDTO();
    // Verificar si el cliente tiene una tarjeta activa
    const tarjeta = await this.tarjetaModel.findTarjetaByClient(identificacionCliente);

    if (!tarjeta) {
      return res.status(404).json(this.tarjetaDto.templateTarjetaNotFound());
    }

    // Obtener el lugar relacionado con el ID proporcionado
    const lugar = await this.tarjetaModel.findLugarById(objectIdLugar);

    if (!lugar) {
      return res.status(404).json(this.tarjetaDto.templateLugarNotFound());
    }

    // Calcular el precio con descuento si aplica
    const { precioOriginal, precioConDescuento } = this.tarjetaModel.calculateDiscount(tarjeta, lugar);

    // Actualizar el precio en la boleta asociada al cliente
    const resultadoBoleta = await this.tarjetaModel.updateBoletaPrice(identificacionCliente, precioConDescuento);

    return res.status(200).json(this.tarjetaDto.templateSuccess({
      precioOriginal,
      precioConDescuento,
      resultadoBoleta
    }));

  } catch (error) {
    console.error("Error en el controlador de tarjetas:", error);
    return res.status(500).json(this.tarjetaDto.templateError("Error interno del servidor"));
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
    const clienteVip = await this.tarjetaModel.findClienteVip(identificacionCliente);

    if (!clienteVip) {
      return res.status(400).json(this.tarjetaDto.templateNotVip());
    }

    // Intentar crear la tarjeta
    const resultado = await this.tarjetaModel.insertTarjeta(tarjetaData);

    return res.status(201).json(this.tarjetaDto.templateTarjetaCreada(resultado));
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
    return res.status(500).json(this.tarjetaDto.templateError("Error interno del servidor"));
  }
}



module.exports = { TarjetaRequest, createTarjeta };
