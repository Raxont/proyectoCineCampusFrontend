const { MongoClient } = require('mongodb');
const connect = require('../infrastructure/database/conexion');

class PeliculaModel extends connect {
    constructor() {
        super();
        this.collection = this.db.collection('pelicula');
    }

    async getAllPeliculas() {
        await this.reconnect();
        const peliculas = await this.collection.find({}).toArray();
        await this.close();
        return peliculas;
    }
}

module.exports = PeliculaModel;
