import { ObjectId } from 'mongodb'; // ? Importa el constructor de ObjectId de MongoDB
import { connect } from '../../helpers/db/conexion.js'; // ? Importa la clase de conexión a la base de datos

export class LugarRepository extends connect {
  static instance; // ! Instancia única del repositorio

  constructor() {
    if (typeof LugarRepository.instance === 'object') {
      return LugarRepository.instance; // ! Retorna la instancia existente si ya está creada
    }
    super(); // ? Llama al constructor de la clase base
    this.collection = this.db.collection('lugar'); // ? Inicializa la colección de lugar en la base de datos
    LugarRepository.instance = this; // ! Guarda la instancia actual para futuras referencias
    return this; // ! Retorna la instancia del repositorio
  }

  //* Verifica permisos del usuario
  hasPermission(permission) { 
    return this.permissions.includes(permission); // ? Retorna el permiso
  }

  //* Obtiene todos los lugares por fecha
  async getAllLugarByDay(fechaInicioFiltro) {
    if (!this.hasPermission('view')) {
      throw new Error('No tienes permiso para ver los lugares.'); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const filter = fechaInicioFiltro ? { fecha_inicio: { $gte: fechaInicioFiltro } } : {}; // ? Obtiene todos los documentos de la colección mayores o iguales que la fechaInicioFiltro
      return await this.collection.find(filter).toArray();  // ? Retorna el resultado
    } catch (error) {
      console.error("Error obteniendo los lugares:", error); // ! Manejo de errores
      throw new Error("Error obteniendo los lugares"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Agrega un nuevo lugar
  async addLugar(lugar) {
    if (!this.hasPermission('add')) {
      throw new Error('No tienes permiso para agregar un lugar.'); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const res = await this.collection.insertOne(lugar); // ? Inserta un nuevo documento en la colección
      return res; // ? Retorna el resultado de la inserción
    } catch (error) {
      console.error("Error agregando un lugar: ", error); // ! Manejo de errores
      throw new Error("Error agregando un lugar"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Actualiza la información de un lugar
  async updateLugar(actualizado) {
    if (!this.hasPermission('update')) {
      throw new Error('No tienes permiso para actualizar el lugar.'); //! Lanza un error si el usuario no tiene el permiso necesario
    }
  
    try {
      const { id, ...updateFields } = actualizado; //? Destructuración del objeto actualizado
      if (!ObjectId.isValid(id)) {
        throw new Error('Formato de ObjectId inválido'); //! Lanza un error si el formato del ID no es válido
      }
      
      const objectId = new ObjectId(id); //? Convierte el ID a ObjectId
  
      return await this.collection.updateOne( //? Retorna el resultado de la actualización
        { _id: objectId }, //? Filtro para encontrar el lugar por ID
        { $set: updateFields } //? Actualiza los campos del lugar
      );
    } catch (error) {
      console.error("Error actualizando el lugar: ", error); //! Manejo de errores
      throw new Error("Error actualizando el lugar"); //! Lanza un error si ocurre un problema
    }
  }

  //* Elimina un lugar por su ID
  async deleteLugar(id) {
    if (!this.hasPermission('delete')) {
      throw new Error('No tienes permiso para eliminar un lugar.'); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null; // ? Valida y convierte el ID a ObjectId
      if (!objectId) {
        throw new Error('Invalid ObjectId format'); // ! Lanza un error si el formato del ID no es válido
      }
      const res = await this.collection.deleteOne({ _id: objectId }); // ? Elimina el documento con el ID especificado
      return res; // ? Retorna el resultado de la eliminación
    } catch (error) {
      console.error("Error eliminando un lugar: ", error); // ! Manejo de errores
      throw new Error("Error eliminando un lugar"); // ! Lanza un error si ocurre un problema
    }
  }
}