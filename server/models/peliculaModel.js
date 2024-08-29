const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class PeliculaModel {
  constructor() {
    this.dbConnection = new connect();
  }

  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("pelicula");
  }

  async findPeliculaById(idPelicula) {
    const pelicula = await this.collection.findOne({
      _id: new ObjectId(idPelicula),
    });
    return pelicula;
  }
}

module.exports = PeliculaModel;
