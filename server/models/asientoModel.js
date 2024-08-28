const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class AsientoModel {
  constructor() {
    this.dbConnection = new connect();
  }

  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("asientos");
  }

  async getAllAsiento(){
    const resultados = await this.collection.find({}).toArray();
    return resultados;
  }
  async findAsientoById(idAsiento) {
    const asiento = await this.collection.findOne({
      _id: new ObjectId(idAsiento),
    });
    return asiento;
  }

  async findBoletaByCliente(identificacionCliente) {
    const boleta = await this.dbConnection
      .getCollection("boleta")
      .findOne({ identificacion_cliente: identificacionCliente });
    return boleta;
  }

  async getAsientosAvailable(idLugar) {
    const resultados = await this.collection
      .aggregate([
        { $match: { id_lugar: new ObjectId(idLugar) } },
        { $project: { id_lugar: 0, _id: 0 } },
      ])
      .toArray();
    return resultados;
  }

  async updateAsientoInBoleta(idAsientos, idLugar, identificacionCliente) {
    try {
        // Convierte los IDs de asientos y el ID de lugar a ObjectId
        const objectIdsAsientos = idAsientos.map(idAsiento => new ObjectId(idAsiento));
        const objectIdLugar = new ObjectId(idLugar);
        
        // Actualiza los asientos, eliminando el lugar de cada asiento
        const resultadoAsientos = await this.collection.updateMany(
            { _id: { $in: objectIdsAsientos } },
            { $pull: { id_lugar: objectIdLugar } }
        );

        // Actualiza la boleta agregando los IDs de asiento
        const resultadoBoleta = await this.dbConnection
            .getCollection("boleta")
            .updateOne(
                { identificacion_cliente: identificacionCliente },
                { $push: { id_asiento: { $each: objectIdsAsientos } } }
            );

        return {
            asientosModificados: resultadoAsientos.modifiedCount > 0,
            boletaModificada: resultadoBoleta.modifiedCount > 0,
        };
    } catch (error) {
        console.error("Error al actualizar los asientos en la boleta:", error);
        throw error; // O maneja el error de acuerdo a tus necesidades
    }
  }


  async revertAsientoInBoleta(idAsientos, idLugar, identificacionCliente) {
    const objectIdsAsientos = idAsientos.map(idAsiento => new ObjectId(idAsiento));
    const objectIdLugar = new ObjectId(idLugar);

    console.log("idAsientos:", objectIdsAsientos);
    console.log("idLugar:", objectIdLugar);
    console.log('identificacionCliente', identificacionCliente);

    identificacionCliente = Number(identificacionCliente);

    // Intenta actualizar los asientos con el idLugar
    const resultadoAsiento = await this.collection.updateMany(
        { _id: { $in: objectIdsAsientos } },
        { $push: { id_lugar: objectIdLugar } }
    );

    console.log('resultadoAsiento.modifiedCount:', resultadoAsiento.modifiedCount);

    // Elimina los id_asiento de la boleta
    const resultadoBoleta = await this.dbConnection
        .getCollection("boleta")
        .updateOne(
            { identificacion_cliente: identificacionCliente },
            { $pull: { id_asiento: { $in: objectIdsAsientos } } }
        );

    console.log('resultadoBoleta.modifiedCount:', resultadoBoleta.modifiedCount);

    return {
        asientoModificado: resultadoAsiento.modifiedCount > 0,
        boletaModificada: resultadoBoleta.modifiedCount > 0,
    };
}

}

module.exports = AsientoModel;
