const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class LugarModel {
  /**
   * Constructor de la clase `LugarModel`.
   * Inicializa la conexión a la base de datos.
   */
  constructor() {
    this.dbConnection = new connect();
  }

  /**
   * Inicializa la conexión a la base de datos y obtiene la colección de lugares.
   * @returns {Promise<void>}
   */
  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("lugar");
  }

  /**
   * Obtiene un lugar por su ID.
   * @param {ObjectId} idLugar - ID del lugar.
   * @returns {Promise<Array>} - Array con los resultados encontrados.
   */
  async getLugar(idLugar) {
    await this.init(); // Inicializa la conexión y colección
    const Id = new ObjectId(idLugar); // Convierte el ID a ObjectId
    const resultados = await this.collection.find({ _id: Id }).toArray(); // Busca en la colección y devuelve los resultados en un array
    return resultados;
  }

  /**
   * Obtiene todos los lugares con una película asociada en un rango de fechas.
   * @param {string} fechaInicioFiltro - Fecha de inicio para el filtro.
   * @param {string} [fechaFinFiltro] - Fecha de fin para el filtro. Si no se proporciona, se usa la fecha actual.
   * @returns {Promise<Array>} - Array con los resultados de lugares y detalles de las películas.
   */
  async getAllLugarWithPeliculaByDay(fechaInicioFiltro, fechaFinFiltro) {
    await this.init(); // Inicializa la conexión y colección
    const filterDateInicio = new Date(fechaInicioFiltro);
    filterDateInicio.setUTCHours(0, 0, 0, 0); // Ajusta la fecha de inicio al comienzo del día

    const filterDateFin = fechaFinFiltro ? new Date(fechaFinFiltro) : new Date();
    filterDateFin.setUTCHours(23, 59, 59, 999); // Ajusta la fecha de fin al final del día

    const filter = {
      fecha_inicio: { $gte: filterDateInicio },
      fecha_fin: { $lte: filterDateFin }
    };

    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "pelicula",
          localField: "id_pelicula",
          foreignField: "_id",
          as: "pelicula",
        },
      },
      { $unwind: "$pelicula" },
      {
        $project: {
          titulo: "$pelicula.titulo",
          genero: "$pelicula.genero",
          img: "$pelicula.img",
          _id: "$pelicula._id"
        },
      },
    ];

    const resultados = await this.collection.aggregate(pipeline).toArray(); // Ejecuta el pipeline de agregación y devuelve los resultados en un array
    return resultados;
  }

  /**
   * Obtiene lugares por película y fecha de inicio.
   * @param {ObjectId} idPelicula - ID de la película.
   * @param {string} fechaInicioFiltro - Fecha de inicio para el filtro.
   * @returns {Promise<Array>} - Array con los resultados de lugares y detalles de la película.
   */
  async getLugaresByPelicula(idPelicula, fechaInicioFiltro) {
    await this.init(); // Inicializa la conexión y colección
    const peliculaId = new ObjectId(idPelicula); // Convierte el ID de la película a ObjectId
    const filterDateInicio = new Date(fechaInicioFiltro);
    filterDateInicio.setUTCHours(0, 0, 0, 0); // Ajusta la fecha de inicio al comienzo del día

    const pipeline = [
      {
        $match: {
          id_pelicula: peliculaId,
          fecha_inicio: { $gte: filterDateInicio }
        }
      },
      {
        $lookup: {
          from: "pelicula",
          localField: "id_pelicula",
          foreignField: "_id",
          as: "pelicula",
        },
      },
      { $unwind: "$pelicula" },
      {
        $project: {
          titulo: "$pelicula.titulo",
          genero: "$pelicula.genero",
          duracion: "$pelicula.duracion",
          sinopsis: "$pelicula.sinopsis",
          fecha_inicio: 1,
          fecha_fin: 1,
          precio: 1,
          _id: 1,
        },
      },
    ];

    const resultados = await this.collection.aggregate(pipeline).toArray(); // Ejecuta el pipeline de agregación y devuelve los resultados en un array
    return resultados;
  }
}

module.exports = LugarModel;
