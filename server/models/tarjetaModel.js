const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class TarjetaModel {
  /**
   * Constructor de la clase `TarjetaModel`.
   * Inicializa la conexión a la base de datos.
   */
  constructor() {
    this.dbConnection = new connect();
  }

  /**
   * Inicializa la conexión a la base de datos y obtiene las colecciones necesarias.
   * @returns {Promise<void>}
   */
  async init() {
    await this.dbConnection.init();
    this.collection = this.dbConnection.getCollection("tarjeta");
    this.boletaCollection = this.dbConnection.getCollection("boleta");
    this.clienteCollection = this.dbConnection.getCollection("cliente");
  }

  /**
   * Encuentra una tarjeta activa para un cliente específico.
   * @param {Number} identificacionCliente - Identificación del cliente.
   * @returns {Object|null} - Tarjeta activa del cliente o null si no se encuentra.
   */
  async findTarjetaByClient(identificacionCliente) {
    const tarjeta = await this.collection.findOne({
      identificacion_cliente: identificacionCliente,
      estado: "activo"
    });
    return tarjeta;
  }

  /**
   * Encuentra una boleta por su ID.
   * @param {ObjectId} idboleta - ID de la boleta.
   * @returns {Object|null} - Boleta con el ID dado o null si no se encuentra.
   */
  async findBoletaById(idboleta) {
    const boleta = await this.boletaCollection.findOne({ _id: new ObjectId(idboleta) });
    return boleta;
  }

  /**
   * Calcula el precio con descuento si aplica.
   * @param {Object} tarjeta - Objeto de la tarjeta del cliente.
   * @param {Object} boleta - Objeto del lugar.
   * @returns {Object} - Precio original y precio con descuento.
   */
  calculateDiscount(tarjeta, boleta) {
    const precioOriginal = boleta.precio;
    let precioConDescuento = precioOriginal;

    if (tarjeta) {
      const descuento = 0.10; // Descuento del 10%
      precioConDescuento = precioOriginal * (1 - descuento);
    }

    return { precioOriginal, precioConDescuento };
  }

  /**
   * Actualiza el precio de la boleta para un cliente específico.
   * @param {Number} identificacionCliente - Identificación del cliente.
   * @param {Number} nuevoPrecio - Nuevo precio para la boleta.
   * @returns {Object} - Resultado de la operación de actualización.
   */
  async updateBoletaPrice(identificacionCliente, nuevoPrecio) {
    const resultado = await this.boletaCollection.updateOne(
      { identificacion_cliente: identificacionCliente },
      { $set: { precio: nuevoPrecio } }
    );

    return resultado;
  }
  
  /**
   * Inserta una nueva tarjeta en la base de datos.
   * @param {Object} tarjetaData - Datos de la tarjeta a crear.
   * @returns {Object} - Resultado de la creación de la tarjeta.
   */
  async insertTarjeta(tarjetaData) {
    const resultado = await this.collection.insertOne(tarjetaData);
    return resultado;
  }

  /**
   * Verifica si el cliente es un usuario VIP.
   * @param {Number} identificacionCliente - Identificación del cliente.
   * @returns {Object|null} - Datos del cliente si es VIP, o null si no lo es.
   */
  async findClienteVip(identificacionCliente) {
    const cliente = await this.clienteCollection.findOne({
      identificacion: identificacionCliente,
      estado: "usuarioVip"
    });
    return cliente;
  }
}

module.exports = TarjetaModel;
