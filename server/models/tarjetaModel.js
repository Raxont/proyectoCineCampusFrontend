const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class TarjetaModel extends connect {
  constructor() {
    super();
    this.collection = this.db.collection("tarjeta");
    this.lugarCollection = this.db.collection("lugar");
    this.boletaCollection = this.db.collection("boleta");
    this.clienteCollection = this.db.collection("cliente");
  }

  /**
   * Encuentra una tarjeta activa para un cliente específico
   * @param {Number} identificacionCliente - Identificación del cliente
   * @returns {Object|null} - Tarjeta activa del cliente o null si no se encuentra
   */
  async findTarjetaByClient(identificacionCliente) {
    await this.reconnect();
    try {
      const tarjeta = await this.collection.findOne({
        identificacion_cliente: identificacionCliente,
        estado: "activo"
      });
      return tarjeta;
    } finally {
      await this.close();
    }
  }

  /**
   * Encuentra un lugar por su ID
   * @param {ObjectId} idLugar - ID del lugar
   * @returns {Object|null} - Lugar con el ID dado o null si no se encuentra
   */
  async findLugarById(idLugar) {
    await this.reconnect();
    try {
      const lugar = await this.lugarCollection.findOne({ _id: idLugar });
      return lugar;
    } finally {
      await this.close();
    }
  }

  /**
   * Calcula el precio con descuento si aplica
   * @param {Object} tarjeta - Objeto de la tarjeta del cliente
   * @param {Object} lugar - Objeto del lugar
   * @returns {Object} - Precio original y precio con descuento
   */
  calculateDiscount(tarjeta, lugar) {
    const precioOriginal = lugar.precio;
    let precioConDescuento = precioOriginal;

    if (tarjeta) {
      const descuento = 0.20; // Descuento del 20%
      precioConDescuento = precioOriginal * (1 - descuento);
    }

    return { precioOriginal, precioConDescuento };
  }

  /**
   * Actualiza el precio de la boleta para un cliente específico
   * @param {Number} identificacionCliente - Identificación del cliente
   * @param {Number} nuevoPrecio - Nuevo precio para la boleta
   * @returns {Object} - Resultado de la operación de actualización
   */
  async updateBoletaPrice(identificacionCliente, nuevoPrecio) {
    await this.reconnect();
    try {
      const resultado = await this.boletaCollection.updateOne(
        { identificacion_cliente: identificacionCliente },
        { $set: { precio: nuevoPrecio } }
      );
      return resultado;
    } finally {
      await this.close();
    }
  }
  
   /**
   * Inserta una nueva tarjeta en la base de datos
   * @param {Object} tarjetaData - Datos de la tarjeta a crear
   * @returns {Object} - Resultado de la creación de la tarjeta
   */
   async insertTarjeta(tarjetaData) {
    await this.reconnect();
    try {
      const resultado = await this.collection.insertOne(tarjetaData);
      return resultado;
    } finally {
      await this.close();
    }
  }

  /**
   * Verifica si el cliente es un usuarioVIP
   * @param {Number} identificacionCliente - Identificación del cliente
   * @returns {Object|null} - Datos del cliente si es VIP, o null si no lo es
   */
  async findClienteVip(identificacionCliente) {
    await this.reconnect();
    try {
      const cliente = await this.clienteCollection.findOne({
        identificacion: identificacionCliente,
        estado: "usuarioVip"
      });
      return cliente;
    } finally {
      await this.close();
    }
  }

}

module.exports = TarjetaModel;
