const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class LugarModel extends connect {
  constructor() {
    super();
    this.collection = this.db.collection("lugar");
  }

  async getAllLugarWithPeliculaByDay(fechaInicioFiltro, fechaFinFiltro) {
    await this.reconnect();
    const filterDateInicio = new Date(fechaInicioFiltro);
    filterDateInicio.setUTCHours(0, 0, 0, 0);
  
    const filterDateFin = fechaFinFiltro ? new Date(fechaFinFiltro) : new Date();
    filterDateFin.setUTCHours(23, 59, 59, 999);
  
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
  
    const resultados = await this.collection.aggregate(pipeline).toArray();
    await this.close();
    return resultados;
  }

  async getLugaresByPelicula(idPelicula, fechaInicioFiltro) {
    await this.reconnect();
    const peliculaId = new ObjectId(idPelicula);
    const filterDateInicio = new Date(fechaInicioFiltro);
    filterDateInicio.setUTCHours(0, 0, 0, 0);
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

    const resultados = await this.collection.aggregate(pipeline).toArray();
    await this.close();
    return resultados;
  }

}

module.exports = LugarModel;
