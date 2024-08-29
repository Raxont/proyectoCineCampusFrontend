const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class PeliculaModel {
  /**
   * Constructor de la clase `PeliculaModel`.
   * Inicializa la conexión a la base de datos.
   */
  constructor() {
    this.dbConnection = new connect();
  }

  /**
   * Inicializa la conexión a la base de datos y obtiene la colección de películas.
   * @returns {Promise<void>}
   */
  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("pelicula");
  }

  /**
   * Encuentra una película por su ID.
   * @param {ObjectId} idPelicula - ID de la película.
   * @returns {Object|null} - Película con el ID dado o null si no se encuentra.
   */
  async findPeliculaById(idPelicula) {
    const pelicula = await this.collection.findOne({
      _id: new ObjectId(idPelicula),
    });
    return pelicula;
  }
}

module.exports = PeliculaModel;
