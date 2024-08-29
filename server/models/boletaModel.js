const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class BoletaModel {
  /**
   * Constructor de la clase `BoletaModel`.
   * Inicializa la conexión a la base de datos.
   */
  constructor() {
    this.dbConnection = new connect();
  }

  /**
   * Inicializa la conexión a la base de datos y obtiene la colección de boletas.
   * @returns {Promise<void>}
   */
  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("boleta");
  }

  /**
   * Obtiene todas las boletas.
   * @returns {Promise<Array>} - Array con todas las boletas.
   */
  async getAllBoletas() {
    const resultados = await this.collection.find({}).toArray(); // Obtiene todas las boletas
    return resultados;
  }

  /**
   * Obtiene boletas filtradas por cliente y lugar.
   * @param {Number|string} identificacion_cliente - Identificación del cliente.
   * @param {string} idLugar - ID del lugar.
   * @returns {Promise<Array>} - Array con boletas que coinciden con los filtros.
   */
  async getBoletasByClienteAndLugar(identificacion_cliente, idLugar) {
    const identificacion = +identificacion_cliente; // Convierte la identificación a número
    const idlugar = new ObjectId(idLugar); // Convierte el ID del lugar a ObjectId

    // Pipeline de agregación para obtener boletas con detalles de asientos, lugar y película
    const pipeline = [
      { $match: { identificacion_cliente: identificacion, id_lugar: idlugar } },
      {
        $lookup: {
          from: "asientos",
          localField: "id_asiento",
          foreignField: "_id",
          as: "asientos",
        },
      },
      {
        $lookup: {
          from: "lugar",
          localField: "id_lugar",
          foreignField: "_id",
          as: "lugar",
        },
      },
      { $unwind: "$lugar" },
      {
        $lookup: {
          from: "pelicula",
          localField: "lugar.id_pelicula",
          foreignField: "_id",
          as: "pelicula",
        },
      },
      { $unwind: "$pelicula" },
      {
        $project: {
          _id: 1,
          estado: 1,
          fecha_adquisicion: 1,
          precio: 1,
          asientos: {
            $map: {
              input: "$asientos",
              as: "asiento",
              in: {
                codigo: "$$asiento.codigo",
                incremento: "$$asiento.incremento",
                tipo_fila: "$$asiento.tipo_fila",
              },
            },
          },
          lugar: {
            idLugar: "$lugar._id",
            nombre: "$lugar.nombre",
            precio: "$lugar.precio",
            fecha_inicio: "$lugar.fecha_inicio",
            fecha_fin: "$lugar.fecha_fin",
          },
          pelicula: {
            titulo: "$pelicula.titulo",
            img: "$pelicula.img",
            genero: "$pelicula.genero",
          },
        },
      },
    ];

    const resultados = await this.collection.aggregate(pipeline).toArray(); // Ejecuta el pipeline de agregación
    return resultados;
  }

  /**
   * Obtiene boletas filtradas solo por cliente.
   * @param {Number|string} identificacion_cliente - Identificación del cliente.
   * @returns {Promise<Array>} - Array con boletas que coinciden con el filtro.
   */
  async getBoletasByCliente(identificacion_cliente) {
    const identificacion = +identificacion_cliente; // Convierte la identificación a número

    // Pipeline de agregación para obtener boletas con detalles de asientos, lugar y película
    const pipeline = [
      { $match: { identificacion_cliente: identificacion } },
      {
        $lookup: {
          from: "asientos",
          localField: "id_asiento",
          foreignField: "_id",
          as: "asientos",
        },
      },
      {
        $lookup: {
          from: "lugar",
          localField: "id_lugar",
          foreignField: "_id",
          as: "lugar",
        },
      },
      { $unwind: "$lugar" },
      {
        $lookup: {
          from: "pelicula",
          localField: "lugar.id_pelicula",
          foreignField: "_id",
          as: "pelicula",
        },
      },
      { $unwind: "$pelicula" },
      {
        $project: {
          _id: 1,
          estado: 1,
          fecha_adquisicion: 1,
          precio: 1,
          asientos: {
            $map: {
              input: "$asientos",
              as: "asiento",
              in: {
                codigo: "$$asiento.codigo",
                incremento: "$$asiento.incremento",
                tipo_fila: "$$asiento.tipo_fila",
              },
            },
          },
          lugar: {
            idLugar: "$lugar._id",
            nombre: "$lugar.nombre",
            precio: "$lugar.precio",
            fecha_inicio: "$lugar.fecha_inicio",
            fecha_fin: "$lugar.fecha_fin",
          },
          pelicula: {
            titulo: "$pelicula.titulo",
            img: "$pelicula.img",
            genero: "$pelicula.genero",
          },
        },
      },
    ];

    const resultados = await this.collection.aggregate(pipeline).toArray(); // Ejecuta el pipeline de agregación
    return resultados;
  }

  /**
   * Agrega una nueva boleta a la colección.
   * @param {Object} boletaData - Datos de la boleta a agregar.
   * @returns {Promise<Object>} - Resultado de la operación de inserción.
   */
  async addBoleta(boletaData) {
    const result = await this.collection.insertOne(boletaData); // Inserta la boleta en la colección
    return result;
  }

  /**
   * Actualiza una boleta existente.
   * @param {string} id - ID de la boleta a actualizar.
   * @param {Object} updatedData - Datos actualizados de la boleta.
   * @returns {Promise<Object>} - Resultado de la operación de actualización.
   */
  async updateBoleta(id, updatedData) {
    const filter = { _id: new ObjectId(id) }; // Filtro para buscar la boleta por ID
    const update = { $set: updatedData }; // Datos a actualizar

    const result = await this.collection.updateOne(filter, update); // Actualiza la boleta en la colección
    return result;
  }

  /**
   * Elimina una boleta existente.
   * @param {string} id - ID de la boleta a eliminar.
   * @returns {Promise<Object>} - Resultado de la operación de eliminación.
   */
  async deleteBoleta(id) {
    const filter = { _id: new ObjectId(id) }; // Filtro para buscar la boleta por ID

    const result = await this.collection.deleteOne(filter); // Elimina la boleta de la colección
    return result;
  }
}

module.exports = BoletaModel;
