const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class AsientoModel extends connect {
  constructor() {
    super();
   
    (async () => {
        if (!this.db) {
            await this.reconnect();
        }
        this.collection = this.getCollection("asientos");
    })();
  }
  
  async findAsientoById(idAsiento) {
    const asiento = await this.collection.findOne({
      _id: new ObjectId(idAsiento),
    });
    return asiento;
  }
  
  async findBoletaByCliente(identificacionCliente) {
    const boleta = await this.db.collection("boleta").findOne({ identificacion_cliente: identificacionCliente });
    return boleta;
  }

  async getAsientosAvailable(idLugar) {
    if (!this.collection) await this.connectToDatabase();
    const resultados = await this.collection
      .aggregate([
        { $match: { id_lugar: new ObjectId(idLugar) } },
        { $project: { id_lugar: 0, _id: 0 } },
      ])
      .toArray();
    console.log(resultados)
    return resultados;
  }

  async updateAsientoInBoleta(idAsiento, idLugar, identificacionCliente) {
    const objectIdAsiento = new ObjectId(idAsiento);
    const objectIdLugar = new ObjectId(idLugar);

    const resultadoAsiento = await this.collection.updateOne(
        { _id: objectIdAsiento },
        { $pull: { id_lugar: objectIdLugar } }
    );

    const resultadoBoleta = await this.db.collection("boleta").updateOne(
        { identificacion_cliente: identificacionCliente },
        { $push: { id_asiento: objectIdAsiento } }
    );

    return {
        asientoModificado: resultadoAsiento.modifiedCount > 0,
        boletaModificada: resultadoBoleta.modifiedCount > 0
    };
  }

  async revertAsientoInBoleta(idAsiento, idLugar, identificacionCliente) {
    const objectIdAsiento = new ObjectId(idAsiento);
    const objectIdLugar = new ObjectId(idLugar);

    const resultadoAsiento = await this.collection.updateOne(
      { _id: objectIdAsiento },
      { $push: { id_lugar: objectIdLugar } }
    );

    const resultadoBoleta = await this.db
      .collection("boleta")
      .updateOne(
        { identificacion_cliente: identificacionCliente },
        { $pull: { id_asiento: objectIdAsiento } }
      );

    return {
      asientoModificado: resultadoAsiento.modifiedCount > 0,
      boletaModificada: resultadoBoleta.modifiedCount > 0,
    };
  }
}

module.exports = AsientoModel;
