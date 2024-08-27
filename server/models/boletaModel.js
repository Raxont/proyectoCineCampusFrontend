const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class BoletaModel extends connect {
  constructor() {
    super();
    (async () => {
        if (!this.db) {
            await this.reconnect();
        }
        this.collection = this.getCollection("boleta");
    })();
  }

  async getAllBoletas() {
    if (!this.collection) await this.connectToDatabase();
    const resultados = await this.collection.find({}).toArray();
    
    return resultados;
  }

  async getBoletasByCliente(identificacion_cliente) {
    if (!this.collection) await this.connectToDatabase();
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
    if (!this.collection) await this.connectToDatabase();
    const result = await this.collection.insertOne(boletaData);
    
    return result;
  }

  async updateBoleta(id, updatedData) {
    if (!this.collection) await this.connectToDatabase();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: updatedData };

    const result = await this.collection.updateOne(filter, update);
    
    return result;
  }

  async deleteBoleta(id) {
    if (!this.collection) await this.connectToDatabase();
    const filter = { _id: new ObjectId(id) };

    const result = await this.collection.deleteOne(filter);
    
    return result;
  }
}

module.exports = BoletaModel;
