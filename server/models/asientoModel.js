const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class AsientoModel {
  /**
   * Constructor de la clase `AsientoModel`.
   * Inicializa la conexión a la base de datos.
   */
  constructor() {
    this.dbConnection = new connect();
  }

  /**
   * Inicializa la conexión a la base de datos y obtiene la colección de asientos.
   * @returns {Promise<void>}
   */
  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("asientos");
  }

  /**
   * Obtiene todos los asientos.
   * @returns {Promise<Array>} - Array con todos los asientos.
   */
  async getAllAsiento() {
    const resultados = await this.collection.find({}).toArray(); // Obtiene todos los asientos
    return resultados;
  }

  /**
   * Busca un asiento por su ID.
   * @param {string} idAsiento - ID del asiento a buscar.
   * @returns {Promise<Object|null>} - El asiento encontrado o null si no existe.
   */
  async findAsientoById(idAsiento) {
    const asiento = await this.collection.findOne({
      _id: new ObjectId(idAsiento), // Convierte el ID a ObjectId
    });
    return asiento;
  }

  /**
   * Busca una boleta por la identificación del cliente.
   * @param {Number|string} identificacionCliente - Identificación del cliente.
   * @returns {Promise<Object|null>} - La boleta encontrada o null si no existe.
   */
  async findBoletaByCliente(identificacionCliente,idLugar) {
    const boleta = await this.dbConnection
      .getCollection("boleta")
      .findOne({ identificacion_cliente: identificacionCliente, id_lugar:idLugar });
    return boleta;
  }

  /**
   * Obtiene los asientos disponibles para un lugar específico.
   * @param {string} idLugar - ID del lugar para el que se buscan los asientos.
   * @returns {Promise<Array>} - Array con los asientos disponibles.
   */
  async getAsientosAvailable(idLugar) {
    const resultados = await this.collection
      .aggregate([
        { $match: { id_lugar: new ObjectId(idLugar) } }, // Filtra por ID de lugar
        { $project: { id_lugar: 0, _id: 0 } }, // Excluye campos no necesarios
      ])
      .toArray(); // Ejecuta el pipeline de agregación
    return resultados;
  }

  /**
   * Actualiza los asientos en una boleta, añadiéndolos a la boleta y eliminando el lugar de los asientos.
   * @param {Array<string>} idAsientos - IDs de los asientos a actualizar.
   * @param {string} idLugar - ID del lugar a eliminar de los asientos.
   * @param {Number|string} identificacionCliente - Identificación del cliente que posee la boleta.
   * @returns {Promise<Object>} - Resultado de la operación con detalles de los cambios realizados.
   * @throws {Error} - Lanza un error si ocurre un problema durante la actualización.
   */
  async updateAsientoInBoleta(idAsientos, idLugar, identificacionCliente) {
    try {
      // Convierte los IDs de asientos y el ID de lugar a ObjectId
      const objectIdsAsientos = idAsientos.map(idAsiento => new ObjectId(idAsiento));
      const objectIdLugar = new ObjectId(idLugar);

      // Actualiza los asientos, eliminando el lugar de cada asiento
      const resultadoAsientos = await this.collection.updateMany(
        { _id: { $in: objectIdsAsientos } },
        { $pull: { id_lugar: objectIdLugar } }
      );

      // Actualiza la boleta agregando los IDs de asiento
      const resultadoBoleta = await this.dbConnection
        .getCollection("boleta")
        .updateOne(
          { identificacion_cliente: identificacionCliente,id_lugar:idLugar },
          { $push: { id_asiento: { $each: objectIdsAsientos } } }
        );

      return {
        asientosModificados: resultadoAsientos.modifiedCount > 0,
        boletaModificada: resultadoBoleta.modifiedCount > 0,
      };
    } catch (error) {
      console.error("Error al actualizar los asientos en la boleta:", error);
      throw error; // O maneja el error de acuerdo a tus necesidades
    }
  }

  /**
   * Revierte la actualización de asientos en una boleta, añadiendo los asientos al lugar y eliminando los IDs de asiento de la boleta.
   * @param {Array<string>} idAsientos - IDs de los asientos a revertir.
   * @param {string} idLugar - ID del lugar a añadir a los asientos.
   * @param {Number|string} identificacionCliente - Identificación del cliente que posee la boleta.
   * @returns {Promise<Object>} - Resultado de la operación con detalles de los cambios realizados.
   */
  async revertAsientoInBoleta(idAsientos, idLugar, identificacionCliente) {
    const objectIdsAsientos = idAsientos.map(idAsiento => new ObjectId(idAsiento));
    const objectIdLugar = new ObjectId(idLugar);

    identificacionCliente = Number(identificacionCliente);

    // Intenta actualizar los asientos con el idLugar
    const resultadoAsiento = await this.collection.updateMany(
      { _id: { $in: objectIdsAsientos } },
      { $push: { id_lugar: objectIdLugar } }
    );

    // Elimina los id_asiento de la boleta
    const resultadoBoleta = await this.dbConnection
      .getCollection("boleta")
      .updateOne(
        { identificacion_cliente: identificacionCliente,id_lugar:idLugar },
        { $pull: { id_asiento: { $in: objectIdsAsientos } } }
      );

    return {
      asientoModificado: resultadoAsiento.modifiedCount > 0,
      boletaModificada: resultadoBoleta.modifiedCount > 0,
    };
  }
}

module.exports = AsientoModel;
