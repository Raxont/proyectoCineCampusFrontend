import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB
import { connect } from "../../helpers/db/conexion.js"; // ? Importa la clase de conexión a la base de datos

export class AsientosRepository extends connect {
  static instance; // ! Instancia única del repositorio

  constructor() {
    if (typeof AsientosRepository.instance === "object") {
      return AsientosRepository.instance; // ! Retorna la instancia existente si ya está creada
    }
    super(); // ? Llama al constructor de la clase base
    this.collection = this.db.collection("asientos"); // ? Inicializa la colección de asientos en la base de datos
    AsientosRepository.instance = this; // ! Guarda la instancia actual para futuras referencias
    return this; // ! Retorna la instancia del repositorio
  }

  //* Verifica permisos del usuario
  hasPermission(permission) {
    return this.permissions.includes(permission); // ? Retorna el permiso
  }

  //* Obtiene todos los asientos
  async getAllAsientos() {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver los asientos."); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      return await this.collection.find().toArray(); // ? Retorna el resultado como un array
    } catch (error) {
      console.error("Error obteniendo los asientos:", error); // ! Manejo de errores
      throw new Error("Error obteniendo los asientos"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Obtiene un asiento por id
  async getAsientoById(id) {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver los asientos."); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const filter = { _id: new ObjectId(id) }; // ? Filtra el documento por _id
      return await this.collection.findOne(filter); // ? Retorna el resultado
    } catch (error) {
      console.error("Error obteniendo el asiento:", error); // ! Manejo de errores
      throw new Error("Error obteniendo el asiento"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Agrega un nuevo asiento
  async addAsiento(asiento) {
    if (!this.hasPermission("add")) {
      throw new Error("No tienes permiso para agregar un asiento."); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const res = await this.collection.insertOne(asiento); // ? Inserta un nuevo documento en la colección
      return res; // ? Retorna el resultado de la inserción
    } catch (error) {
      console.error("Error agregando un asiento: ", error); // ! Manejo de errores
      throw new Error("Error agregando un asiento"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Actualiza la información de un asiento
  async updateAsiento(actualizado) {
    if (!this.hasPermission("update")) {
      throw new Error("No tienes permiso para actualizar el asiento."); //! Lanza un error si el usuario no tiene el permiso necesario
    }

    try {
      const { id, ...updateFields } = actualizado; //? Destructuración del objeto actualizado
      if (!ObjectId.isValid(id)) {
        throw new Error("Formato de ObjectId inválido"); //! Lanza un error si el formato del ID no es válido
      }

      const objectId = new ObjectId(id); //? Convierte el ID a ObjectId

      return await this.collection.updateOne(
        //? Retorna el resultado de la actualización
        { _id: objectId }, //? Filtro para encontrar el asiento por ID
        { $set: updateFields } //? Actualiza los campos del asiento
      );
    } catch (error) {
      console.error("Error actualizando el asiento: ", error); //! Manejo de errores
      throw new Error("Error actualizando el asiento"); //! Lanza un error si ocurre un problema
    }
  }

  //* Elimina el asiento por su ID
  async deleteAsiento(id) {
    if (!this.hasPermission("delete")) {
      throw new Error("No tienes permiso para eliminar un asiento."); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null; // ? Valida y convierte el ID a ObjectId
      if (!objectId) {
        throw new Error("Formato de ObjectId inválido"); // ! Lanza un error si el formato del ID no es válido
      }
      const res = await this.collection.deleteOne({ _id: objectId }); // ? Elimina el documento con el ID especificado
      return res; // ? Retorna el resultado de la eliminación
    } catch (error) {
      console.error("Error eliminando un asiento: ", error); // ! Manejo de errores
      throw new Error("Error eliminando un asiento"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Permite la selección y reserva de asientos para una proyección específica.
  async updateAsientoInBoleta(informacion) {
    const { idAsiento, idLugar, identificacionCliente } = informacion; //? Desestructura el objeto 'informacion'
  
    if (!this.hasPermission("update")) {
      throw new Error("No tienes permiso para actualizar la boleta."); // ! Lanza un error si el usuario no tiene el permiso necesario
    }
  
    if (!ObjectId.isValid(idAsiento) || !ObjectId.isValid(idLugar)) {
      throw new Error("Formato de ObjectId inválido"); // ! Lanza un error si el formato del ID no es válido
    }
  
    const objectIdAsiento = new ObjectId(idAsiento);
    const objectIdLugar = new ObjectId(idLugar);
  
    try {
      //? Pipeline de agregación
      const pipeline = [
        { $match: { _id: objectIdAsiento, id_lugar: objectIdLugar } }, //? Verifica si el idLugar existe en el idAsiento
        { $project: { _id: 1 } } //? Solo necesitamos el _id
      ];
  
      const asientoExiste = await this.collection.aggregate(pipeline).toArray();
  
      if (asientoExiste.length === 0) {
        throw new Error("El idLugar no existe en el idAsiento"); // ! Lanza un error si el idLugar no existe en el idAsiento
      }
  
      //? Elimina el idLugar de id_lugar en la colección de asientos
      await this.collection.updateOne(
        { _id: objectIdAsiento },
        { $pull: { id_lugar: objectIdLugar } }
      );
  
      //? Agrega el idAsiento en la colección de boleta usando la identificación_cliente para filtrar la boleta
      await this.db.collection("boleta").updateOne(
        { identificacion_cliente: identificacionCliente },
        { $set: { id_asiento: objectIdAsiento } }
      );
  
      return { message: "Asiento actualizado correctamente en la boleta." };
    } catch (error) {
      console.error("Error actualizando el asiento en la boleta:", error);
      throw new Error("Error actualizando el asiento en la boleta"); // ! Lanza un error en caso de fallo en la actualización
    }
  }
}