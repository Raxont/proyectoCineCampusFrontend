const  {ObjectId}  = require("mongodb"); //  Importa el constructor de ObjectId de MongoDB
const  connect  = require("../../helpers/db/conexion"); //  Importa la clase de conexión a la base de datos

module.exports = class asientoRepository extends connect {
  static instance; //  Instancia única del repositorio

  constructor() {
    if (typeof asientoRepository.instance === "object") {
      return asientoRepository.instance; //  Retorna la instancia existente si ya está creada
    }
    super(); //  Llama al constructor de la clase base
    this.collection = this.db.collection("asientos"); //  Inicializa la colección de asientos en la base de datos
    asientoRepository.instance = this; //  Guarda la instancia actual para futuras referencias
    return this; //  Retorna la instancia del repositorio
  }

  /**
   * Verifica si el usuario tiene el permiso especificado
   * @param {String} permission - Permiso requerido
   * @returns {Boolean} - Retorna verdadero si el usuario tiene el permiso
   */
  hasPermission(permission) {
    return this.permissions.includes(permission); //  Retorna el permiso
  }

  /**
   * Permite la cancelación de una reserva de asiento ya realizada
   * ? Valores a usar {idAsiento: new ObjectId("66a6d3fa1c9570011db88fdb"),idLugar: new ObjectId("66a579bb7b00907fab0aee94"),identificacionCliente: 1234567890}
   * @param {Object} informacion - Información para revertir la reserva del asiento
   * @param {String} informacion.idAsiento - ID del asiento
   * @param {String} informacion.idLugar - ID del lugar
   * @param {String} informacion.identificacionCliente - Identificación del cliente
   * @returns {Object} - Mensaje y detalles del asiento revertido
   */
  async revertAsientoInBoleta(informacion) {
    const { idAsiento, idLugar, identificacionCliente } = informacion; // Desestructura el objeto 'informacion'

    if (!this.hasPermission("update")) {
      throw new Error("No tienes permiso para actualizar la boleta."); //  Lanza un error si el usuario no tiene el permiso necesario
    }

    if (!ObjectId.isValid(idAsiento) || !ObjectId.isValid(idLugar)) {
      throw new Error("Formato de ObjectId inválido"); //  Lanza un error si el formato del ID no es válido
    }

    const objectIdAsiento = new ObjectId(idAsiento);
    const objectIdLugar = new ObjectId(idLugar);

    try {
      // Pipeline de agregación
      const pipeline = [
        { $match: { _id: objectIdAsiento } }, // Verifica si el idAsiento existe en la colección de asientos
        { $project: { _id: 1 } } // Solo necesitamos el _id
      ];

      const asientoExiste = await this.collection.aggregate(pipeline).toArray();

      if (asientoExiste.length === 0) {
        throw new Error("Este asiento no existe en la base de datos."); //  Lanza un error si el idAsiento no existe
      }

      // Agrega el idLugar en id_lugar en la colección de asientos
      const resultadoAsiento = await this.collection.updateOne(
        { _id: objectIdAsiento },
        { $push: { id_lugar: objectIdLugar } }
      );

      // Elimina el idAsiento en la colección de boleta usando la identificación_cliente para filtrar la boleta
      const resultadoBoleta = await this.db.collection("boleta").updateOne(
        { identificacion_cliente: identificacionCliente },
        { $pull: { id_asiento: objectIdAsiento } }
      );

      return {
        message: "Asiento revertido correctamente en la boleta.",
        movimientos: {
          asiento: resultadoAsiento.modifiedCount ? `idLugar ${idLugar} agregado a idAsiento ${idAsiento}` : `No se agregó idLugar ${idLugar} a idAsiento ${idAsiento}`,
          boleta: resultadoBoleta.modifiedCount ? `idAsiento ${idAsiento} eliminado de la boleta del cliente ${identificacionCliente}` : `No se eliminó idAsiento ${idAsiento} de la boleta del cliente ${identificacionCliente}`
        }
      };
    } catch (error) {
      console.error("Error revirtiendo el asiento en la boleta:", error);
      throw new Error("Error revirtiendo el asiento en la boleta"); // Lanza un error en caso de fallo en la actualización
    }
  }

  /**
   * Permite la selección y reserva de asientos para una proyección específica
   * ? Valores a usar {idAsiento: new ObjectId("66a6d3fa1c9570011db88fdb"),idLugar: new ObjectId("66a579bb7b00907fab0aee94"),identificacionCliente: 1234567890}
   * @param {Object} informacion - Información para actualizar la reserva del asiento
   * @param {String} informacion.idAsiento - ID del asiento
   * @param {String} informacion.idLugar - ID del lugar
   * @param {String} informacion.identificacionCliente - Identificación del cliente
   * @returns {Object} - Mensaje y detalles del asiento actualizado
   */
  async updateAsientoInBoleta(informacion) {
    const { idAsiento, idLugar, identificacionCliente } = informacion; // Desestructura el objeto 'informacion'
  
    if (!this.hasPermission("update")) {
      throw new Error("No tienes permiso para actualizar la boleta."); //  Lanza un error si el usuario no tiene el permiso necesario
    }
  
    if (!ObjectId.isValid(idAsiento) || !ObjectId.isValid(idLugar)) {
      throw new Error("Formato de ObjectId inválido"); //  Lanza un error si el formato del ID no es válido
    }
  
    const objectIdAsiento = new ObjectId(idAsiento);
    const objectIdLugar = new ObjectId(idLugar);
  
    try {
      // Pipeline de agregación
      const pipeline = [
        { $match: { _id: objectIdAsiento, id_lugar: objectIdLugar } }, // Verifica si el idLugar existe en el idAsiento
        { $project: { _id: 1 } } // Solo necesitamos el _id
      ];
  
      const asientoExiste = await this.collection.aggregate(pipeline).toArray();
  
      if (asientoExiste.length === 0) {
        throw new Error("Este asiento no esta disponible en estos momentos"); //  Lanza un error si el idLugar no existe en el idAsiento
      }
  
      // Elimina el idLugar de id_lugar en la colección de asientos
      const resultadoAsiento=await this.collection.updateOne(
        { _id: objectIdAsiento },
        { $pull: { id_lugar: objectIdLugar } }
      );
      // Agrega el idAsiento en la colección de boleta usando la identificación_cliente para filtrar la boleta
      const resultadoBoleta=await this.db.collection("boleta").updateOne(
        { identificacion_cliente: identificacionCliente },
        { $push: { id_asiento: objectIdAsiento } }
      );
  
      return {
        message: "Asiento actualizado correctamente en la boleta.",
        movimientos: {
          asiento: resultadoAsiento.modifiedCount ? `idLugar ${idLugar} eliminado de idAsiento ${idAsiento}` : `No se eliminó idLugar ${idLugar} de idAsiento ${idAsiento}`,
          boleta: resultadoBoleta.modifiedCount ? `idAsiento ${idAsiento} agregado a la boleta del cliente ${identificacionCliente}` : `No se agregó idAsiento ${idAsiento} a la boleta del cliente ${identificacionCliente}`
        }
      };
    } catch (error) {
      console.error("Error actualizando el asiento en la boleta:", error);
      throw new Error("Error actualizando el asiento en la boleta"); //  Lanza un error en caso de fallo en la actualización
    }
  }
}