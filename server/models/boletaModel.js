const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class BoletaModel extends connect {
  constructor() {
    super();
    this.collection = this.db.collection("boleta");
    this.asientosCollection = this.db.collection("asientos");
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

    const resultados = await this.asientosCollection.aggregate([
      { $match: { id_lugar: new ObjectId(id_lugar) } },
      { $project: { id_lugar: 0 ,_id:0} }
    ]).toArray();
    
    
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
