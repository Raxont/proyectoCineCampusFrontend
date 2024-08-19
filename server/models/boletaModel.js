const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class BoletaModel extends connect {
  constructor() {
    super();
    this.collection = this.db.collection("boleta");
  }

  async getAllBoletas() {
    await this.reconnect();
    const resultados = await this.collection.find({}).toArray();
    await this.close();
    return resultados;
  }

  async getBoletasByCliente(identificacion_cliente) {
    await this.reconnect();
    const identificacion = +identificacion_cliente
    let filter = { identificacion_cliente: identificacion };
    const resultados = await this.collection.find(filter).toArray();
    await this.close();
    return resultados;
  }

  async getAsientosAvailable(id_lugar) {
    await this.reconnect();
    

    const pipeline = [
        {
            $match: { id_lugar: new ObjectId(id_lugar) }, //  Filtra por lugar
        },
        {
          $lookup: {
            from: "asientos", //  Nombre de la colección de asientos
            localField: "id_lugar", //  Campo en la colección de boletas
            foreignField: "id_lugar", //  Campo en la colección de asientos
            as: "asientos", //  Nombre del campo en el resultado
          },
        },
        {
          $unwind: "$asientos", //  Descompone el array de asiento
        },
        {
         $project: {
            tipo_fila: "$asientos.tipo_fila", //  Incluye el campo tipo_fila en el resultado final
            codigo: "$asientos.codigo", //  Incluye el campo codigo en el resultado final
            incremento: "$asientos.incremento", //  Incluye el campo incremento en el resultado final
          },
        },
      ];

    const resultados = await this.collection.aggregate(pipeline).toArray();
    await this.close();
    return resultados;
  }

  async addBoleta(boletaData) {
    await this.reconnect();
    const result = await this.collection.insertOne(boletaData);
    await this.close();
    return result;
  }

  async updateBoleta(id, updatedData) {
    await this.reconnect();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: updatedData };

    const result = await this.collection.updateOne(filter, update);
    await this.close();
    return result;
  }

  async deleteBoleta(id) {
    await this.reconnect();
    const filter = { _id: new ObjectId(id) };

    const result = await this.collection.deleteOne(filter);
    await this.close();
    return result;
  }
}

module.exports = BoletaModel;
