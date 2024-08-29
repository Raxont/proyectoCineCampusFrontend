const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class BoletaModel {
  constructor() {
    this.dbConnection = new connect();
  }

  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("boleta");
  }

  async getAllBoletas() {
    const resultados = await this.collection.find({}).toArray();
    return resultados;
  }

  async getBoletasByClienteAndLugar(identificacion_cliente,idLugar) {
    const identificacion = +identificacion_cliente;
    const idlugar=new ObjectId(idLugar);
    const pipeline = [
      { $match: { identificacion_cliente: identificacion,id_lugar:idlugar } },
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

    const resultados = await this.collection.aggregate(pipeline).toArray();
    return resultados;
  }

  async getBoletasByCliente(identificacion_cliente) {
    const identificacion = +identificacion_cliente;

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

    const resultados = await this.collection.aggregate(pipeline).toArray();
    return resultados;
  }

  async addBoleta(boletaData) {
    const result = await this.collection.insertOne(boletaData);
    return result;
  }

  async updateBoleta(id, updatedData) {
    const filter = { _id: new ObjectId(id) };
    const update = { $set: updatedData };

    const result = await this.collection.updateOne(filter, update);
    return result;
  }

  async deleteBoleta(id) {
    const filter = { _id: new ObjectId(id) };

    const result = await this.collection.deleteOne(filter);
    return result;
  }
}

module.exports = BoletaModel;
