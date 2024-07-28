import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB
import { connect } from "../../helpers/db/conexion.js"; // ? Importa la clase de conexión a la base de datos

export class PeliculaRepository extends connect {
  static instance; // ! Instancia única del repositorio

  constructor() {
    if (typeof PeliculaRepository.instance === "object") {
      return PeliculaRepository.instance; // ! Retorna la instancia existente si ya está creada
    }
    super(); // ? Llama al constructor de la clase base
    this.collection = this.db.collection("pelicula"); // ? Inicializa la colección de pelicula en la base de datos
    PeliculaRepository.instance = this; // ! Guarda la instancia actual para futuras referencias
    return this; // ! Retorna la instancia del repositorio
  }

  //* Verifica permisos del usuario
  hasPermission(permission) {
    return this.permissions.includes(permission); // ? Retorna el permiso
  }
  
  //* Obtiene todas las películas
  async getAllPelicula() {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver las películas."); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      return await this.collection.find().toArray(); // ? Retorna el resultado como un array
    } catch (error) {
      console.error("Error obteniendo las películas:", error); // ! Manejo de errores
      throw new Error("Error obteniendo las películas"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Obtiene una pelicula por id
  async getPeliculaById(id) {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver las peliculas."); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const filter = { _id: id }; // ? Filtra el documento por _id
      return await this.collection.findOne(filter); // ? Retorna el resultado
    } catch (error) {
      console.error("Error obteniendo la pelicula:", error); // ! Manejo de errores
      throw new Error("Error obteniendo la pelicula"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Agrega una nueva pelicula
  async addPelicula(pelicula) {
    if (!this.hasPermission("add")) {
      throw new Error("No tienes permiso para agregar un pelicula."); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const res = await this.collection.insertOne(pelicula); // ? Inserta un nuevo documento en la colección
      return res; // ? Retorna el resultado de la inserción
    } catch (error) {
      console.error("Error agregando una pelicula: ", error); // ! Manejo de errores
      throw new Error("Error agregando una pelicula"); // ! Lanza un error si ocurre un problema
    }
  }

  //* Actualiza la información de una pelicula
  async updatePelicula(actualizado) {
    if (!this.hasPermission("update")) {
      throw new Error("No tienes permiso para actualizar la pelicula."); //! Lanza un error si el usuario no tiene el permiso necesario
    }

    try {
      const { id, ...updateFields } = actualizado; //? Destructuración del objeto actualizado
      if (!ObjectId.isValid(id)) {
        throw new Error("Formato de ObjectId inválido"); //! Lanza un error si el formato del ID no es válido
      }

      const objectId = new ObjectId(id); //? Convierte el ID a ObjectId

      return await this.collection.updateOne(
        //? Retorna el resultado de la actualización
        { _id: objectId }, //? Filtro para encontrar la pelicula por ID
        { $set: updateFields } //? Actualiza los campos de la pelicula
      );
    } catch (error) {
      console.error("Error actualizando la pelicula: ", error); //! Manejo de errores
      throw new Error("Error actualizando la pelicula"); //! Lanza un error si ocurre un problema
    }
  }

  //* Elimina la pelicula por su ID
  async deletePelicula(id) {
    if (!this.hasPermission("delete")) {
      throw new Error("No tienes permiso para eliminar una pelicula."); // ! Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null; // ? Valida y convierte el ID a ObjectId
      if (!objectId) {
        throw new Error("Invalid ObjectId format"); // ! Lanza un error si el formato del ID no es válido
      }
      const res = await this.collection.deleteOne({ _id: objectId }); // ? Elimina el documento con el ID especificado
      return res; // ? Retorna el resultado de la eliminación
    } catch (error) {
      console.error("Error eliminando una pelicula: ", error); // ! Manejo de errores
      throw new Error("Error eliminando una pelicula"); // ! Lanza un error si ocurre un problema
    }
  }
}
