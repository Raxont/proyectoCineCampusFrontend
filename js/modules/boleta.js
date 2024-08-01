import { ObjectId } from "mongodb"; // Importa el constructor de ObjectId de MongoDB
import { connect } from "../../helpers/db/conexion.js"; // Importa la clase de conexión a la base de datos

export class BoletaRepository extends connect {
  static instance; //  Instancia única del repositorio

  constructor() {
    if (typeof BoletaRepository.instance === "object") {
      return BoletaRepository.instance; //  Retorna la instancia existente si ya está creada
    }
    super(); //  Llama al constructor de la clase base
    this.collection = this.db.collection("boleta"); //  Inicializa la colección de boleta en la base de datos
    BoletaRepository.instance = this; //  Guarda la instancia actual para futuras referencias
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
   * Verifica si el usuario especificado es el usuario actual
   * @param {String} users - Usuario a verificar
   * @returns {Boolean} - Retorna verdadero si el usuario es el usuario actual
   */
  whoUser(users){
    return this.user.includes(users); // Retorna el usuario
  }

  /**
   * Obtiene todas las boletas
   * @returns {Array} - Lista de boletas
   * @throws {Error} - Lanza un error si el usuario no tiene permiso o si ocurre un problema en la consulta
   */
  async getAllboleta() {
    if (!this.hasPermission("view")|| !this.whoUser("admin")) {
      throw new Error("No tienes permiso para ver las boletas."); //  Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      return await this.collection.find().toArray(); //  Retorna el resultado como un array
    } catch (error) {
      console.error("Error obteniendo las boletas:", error); //  Manejo de errores
      throw new Error("Error obteniendo las boletas"); //  Lanza un error si ocurre un problema
    }
  }

  /**
   * Obtiene boletas por identificación de cliente y trae la fecha de inicio de cada boleta
   * ? Valores a usar {identificacion_cliente: 1234567890,id_lugar: new ObjectId("66a579bb7b00907fab0aee94"),fecha_adquisicion: new Date(),estado: "en_linea",id_asiento: []}
   * @param {String} identificacionCliente - Identificación del cliente
   * @returns {Array} - Lista de boletas con fecha de inicio
   * @throws {Error} - Lanza un error si el usuario no tiene permiso o si ocurre un problema en la consulta
   */
  async getBoletasWithFecha_Inicio(identificacionCliente) {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver las boletas."); //  Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      // Pipeline de agregación
      const pipeline = [
        {
          $match: { identificacion_cliente: identificacionCliente }, //  Filtra por identificación_cliente
        },
        {
          $lookup: {
            from: "lugar", //  Nombre de la colección de lugares
            localField: "id_lugar", //  Campo en la colección de boletas
            foreignField: "_id", //  Campo en la colección de lugares
            as: "lugar", //  Nombre del campo en el resultado
          },
        },
        {
          $unwind: "$lugar", //  Descompone el array de lugar
        },
        {
          $addFields: {
            fechaHora_pelicula: "$lugar.fecha_inicio", //  Añade el campo fecha_inicio al resultado
          },
        },
        {
          $project: {
            lugar: 0, //  Excluye el campo lugar del resultado final
            _id:0 //  Excluye el campo _id del resultado final
          },
        },
      ];

      return await this.collection.aggregate(pipeline).toArray(); // Ejecuta el pipeline de agregación y convierte el resultado a un array
    } catch (error) {
      console.error("Error obteniendo boletas con fecha de inicio:", error); //  Manejo de errores
      throw new Error("Error obteniendo boletas con fecha de inicio"); // !Lanza un error si ocurre un problema
    }
  }
  
  /**
   * Obtiene los asientos disponibles en un lugar específico
   * ? Valores a usar {new ObjectId("66a579bb7b00907fab0aee94")}
   * @param {String} idLugar - ID del lugar
   * @returns {Array} - Lista de asientos disponibles
   * @throws {Error} - Lanza un error si el usuario no tiene permiso o si ocurre un problema en la consulta
   */
  async getAsientosAvailable(idLugar) {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver las boletas."); //  Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      // Pipeline de agregación
      const pipeline = [
        {
            $match: { id_lugar: new ObjectId(idLugar) }, //  Filtra por lugar
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

      return await this.collection.aggregate(pipeline).toArray(); //  Ejecuta el pipeline de agregación y convierte el resultado a un array
    } catch (error) {
      console.error("Error obteniendo los asientos disponibles:", error); //  Manejo de errores
      throw new Error("Error obteniendo los asientos disponibles"); //  Lanza un error si ocurre un problema
    }
  }

   /**
   * Agrega una nueva boleta
   * @param {Object} boleta - Información de la boleta a agregar
   * @returns {Object} - Resultado de la inserción
   * @throws {Error} - Lanza un error si el usuario no tiene permiso o si ocurre un problema en la inserción
   */
  async addboleta(boleta) {
    if (!this.hasPermission("add")) {
      throw new Error("No tienes permiso para agregar un boleta."); //  Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const res = await this.collection.insertOne(boleta); //  Inserta un nuevo documento en la colección
      return res; //  Retorna el resultado de la inserción
    } catch (error) {
      console.error("Error agregando una boleta: ", error); //  Manejo de errores
      throw new Error("Error agregando una boleta"); //  Lanza un error si ocurre un problema
    }
  }

   /**
   * Actualiza la información de una boleta
   * ? Valores a usar {id: new ObjectId("66a5238f31e93ae393b3e498"),estado: "fisico"}
   * @param {Object} actualizado - Información actualizada de la boleta
   * @param {String} actualizado.id - ID de la boleta a actualizar
   * @param {Object} actualizado.updateFields - Campos a actualizar
   * @returns {Object} - Resultado de la actualización
   * @throws {Error} - Lanza un error si el usuario no tiene permiso, si el ID es inválido, o si ocurre un problema en la actualización
   */
  async updateboleta(actualizado) {
    if (!this.hasPermission("update")) {
      throw new Error("No tienes permiso para actualizar la boleta."); // Lanza un error si el usuario no tiene el permiso necesario
    }

    try {
      const { id, ...updateFields } = actualizado; // Destructuración del objeto actualizado
      if (!ObjectId.isValid(id)) {
        throw new Error("Formato de ObjectId inválido"); // Lanza un error si el formato del ID no es válido
      }

      const objectId = new ObjectId(id); // Convierte el ID a ObjectId

      return await this.collection.updateOne(
        // Retorna el resultado de la actualización
        { _id: objectId }, // Filtro para encontrar la boleta por ID
        { $set: updateFields } // Actualiza los campos de la boleta
      );
    } catch (error) {
      console.error("Error actualizando la boleta: ", error); // Manejo de errores
      throw new Error("Error actualizando la boleta"); // Lanza un error si ocurre un problema
    }
  }

   /**
   * Elimina la boleta por su ID
   * ? Valores a usar {"66a5238f31e93ae393b3e498"}
   * @param {String} id - ID de la boleta a eliminar
   * @returns {Object} - Resultado de la eliminación
   * @throws {Error} - Lanza un error si el usuario no tiene permiso, si el ID es inválido, o si ocurre un problema en la eliminación
   */
  async deleteboleta(id) {
    if (!this.hasPermission("delete")) {
      throw new Error("No tienes permiso para eliminar una boleta."); //  Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null; //  Valida y convierte el ID a ObjectId
      if (!objectId) {
        throw new Error("Invalid ObjectId format"); //  Lanza un error si el formato del ID no es válido
      }
      const res = await this.collection.deleteOne({ _id: objectId }); //  Elimina el documento con el ID especificado
      return res; // Retorna el resultado de la eliminación
    } catch (error) {
      console.error("Error eliminando una boleta: ", error); //  Manejo de errores
      throw new Error("Error eliminando una boleta"); //  Lanza un error si ocurre un problema
    }
  }
}
