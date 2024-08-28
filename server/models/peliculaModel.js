const { MongoClient } = require('mongodb');
const connect = require('../infrastructure/database/conexion');

class PeliculaModel{
    constructor() {
        this.dbConnection = new connect();
      }
    
      async init() {
        await this.dbConnection.init(); // Asegúrate de inicializar la conexión
        this.collection = this.dbConnection.getCollection("pelicula");
      }

    async getAllPeliculas() {
        await this.reconnect();
        const peliculas = await this.collection.find({}).toArray();
        await this.close();
        return peliculas;
    }
}

module.exports = PeliculaModel;
