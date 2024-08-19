const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class AsientoModel extends connect {
  constructor() {
    super();
    this.collection = this.db.collection("asientos");
  }

  async findAsientoById(idAsiento) {
    await this.reconnect();
    const asiento = await this.collection.findOne({
      _id: new ObjectId(idAsiento),
    });
    await this.close();
    return asiento;
  }
  
  async findBoletaByCliente(identificacionCliente) {
    await this.reconnect();
    const boleta = await this.db.collection("boleta").findOne({ identificacion_cliente: identificacionCliente });
    await this.close();
    return boleta;
}

  async updateAsientoInBoleta(idAsiento, idLugar, identificacionCliente) {
    await this.reconnect();
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

    await this.close();

    return {
        asientoModificado: resultadoAsiento.modifiedCount > 0,
        boletaModificada: resultadoBoleta.modifiedCount > 0
    };
}

  async revertAsientoInBoleta(idAsiento, idLugar, identificacionCliente) {
    await this.reconnect();
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

    await this.close();

    return {
      asientoModificado: resultadoAsiento.modifiedCount > 0,
      boletaModificada: resultadoBoleta.modifiedCount > 0,
    };
  }
}

module.exports = AsientoModel;
