const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class LugarModel extends connect {
  constructor() {
    super();
    this.collection = this.db.collection("lugar");
  }

  async getAllLugarWithPeliculaByDay(fechaInicioFiltro) {
    await this.reconnect();
    const filterDate = new Date(fechaInicioFiltro);
    filterDate.setUTCHours(0, 0, 0, 0);

    const filter = { fecha_inicio: { $gte: filterDate } };
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
          duracion: "$pelicula.duracion",
          fecha_inicio: 1,
          fecha_fin: 1,
          _id: 0,
        },
      },
    ];

    const resultados = await this.collection.aggregate(pipeline).toArray();
    await this.close();
    return resultados;
  }

  async getLugaresByPelicula(idPelicula) {
    await this.reconnect();
    const peliculaId = new ObjectId(idPelicula);

    const pipeline = [
      { $match: { id_pelicula: peliculaId } },
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
          _id: 0,
        },
      },
    ];

    const resultados = await this.collection.aggregate(pipeline).toArray();
    await this.close();
    return resultados;
  }
}

module.exports = LugarModel;
