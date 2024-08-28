const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class TarjetaModel {
  constructor() {
    this.dbConnection = new connect();
  }

  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("tarjeta");
    this.lugarCollection = this.dbConnection.getCollection("lugar");
    this.boletaCollection = this.dbConnection.getCollection("boleta");
    this.clienteCollection = this.dbConnection.getCollection("cliente");
  }

  /**
   * Encuentra una tarjeta activa para un cliente específico
   * @param {Number} identificacionCliente - Identificación del cliente
   * @returns {Object|null} - Tarjeta activa del cliente o null si no se encuentra
   */
  async findTarjetaByClient(identificacionCliente) {
    const tarjeta = await this.collection.findOne({
      identificacion_cliente: identificacionCliente,
      estado: "activo"
    });
    return tarjeta;
  }

  /**
   * Encuentra un lugar por su ID
   * @param {ObjectId} idLugar - ID del lugar
   * @returns {Object|null} - Lugar con el ID dado o null si no se encuentra
   */
  async findLugarById(idLugar) {
    const lugar = await this.lugarCollection.findOne({ _id: new ObjectId(idLugar) });
    return lugar;
  }

  /**
   * Calcula el precio con descuento si aplica
   * @param {Object} tarjeta - Objeto de la tarjeta del cliente
   * @param {Object} boleta - Objeto del lugar
   * @returns {Object} - Precio original y precio con descuento
   */
  calculateDiscount(tarjeta, boleta) {
    const precioOriginal = boleta.precio;
    let precioConDescuento = precioOriginal;

    if (tarjeta) {
      const descuento = 0.10; // Descuento del 10%
      precioConDescuento = Math.floor(precioOriginal * (1 - descuento));
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
    const resultado = await this.boletaCollection.updateOne(
      { identificacion_cliente: identificacionCliente },
      { $set: { precio: nuevoPrecio } }
    );

    return resultado;
  }
  
  /**
   * Inserta una nueva tarjeta en la base de datos
   * @param {Object} tarjetaData - Datos de la tarjeta a crear
   * @returns {Object} - Resultado de la creación de la tarjeta
   */
  async insertTarjeta(tarjetaData) {
    const resultado = await this.collection.insertOne(tarjetaData);
    return resultado;
  }

  /**
   * Verifica si el cliente es un usuario VIP
   * @param {Number} identificacionCliente - Identificación del cliente
   * @returns {Object|null} - Datos del cliente si es VIP, o null si no lo es
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
