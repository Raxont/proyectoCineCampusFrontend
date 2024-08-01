import { ObjectId } from "mongodb"; //  Importa el constructor de ObjectId de MongoDB
import { connect } from "../../helpers/db/conexion.js"; //  Importa la clase de conexión a la base de datos

export class LugarRepository extends connect {
  static instance; //  Instancia única del repositorio

  constructor() {
    if (typeof LugarRepository.instance === "object") {
      return LugarRepository.instance; //  Retorna la instancia existente si ya está creada
    }
    super(); // ? Llama al constructor de la clase base
    this.collection = this.db.collection("lugar"); //  Inicializa la colección de lugar en la base de datos
    LugarRepository.instance = this; //  Guarda la instancia actual para futuras referencias
    return this; //  Retorna la instancia del repositorio
  }

  /**
   * Verifica si el usuario tiene el permiso especificado
   * @param {String} permission - Permiso requerido
   * @returns {Boolean} - Retorna verdadero si el usuario tiene el permiso
   */
  hasPermission(permission) {
    return this.permissions.includes(permission); // ? Retorna el permiso
  }

  /**
   * Obtiene todos los lugares por fecha y une con la información de las películas
   * ? Valor a usar {fechaHoy = new Date()}
   * @param {Date} fechaInicioFiltro - Fecha de inicio para filtrar los lugares
   * @returns {Array} - Lista de lugares con detalles de las películas
   */
  async getAllLugarWithPeliculaByDay(fechaInicioFiltro) {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver los lugares."); // Lanza un error si el usuario no tiene ese permiso
    }
    try {
      // Asegúrate de que la fecha de filtro esté en UTC y sin la parte de tiempo si deseas filtrar por días completos
      const filterDate = new Date(fechaInicioFiltro);
      filterDate.setUTCHours(0, 0, 0, 0); // Configura al inicio del día en UTC

      console.log(`Filtrando lugares con fecha_inicio >= ${filterDate.toISOString()}`);

      // Crea un filtro para obtener documentos cuyo fecha_inicio sea mayor o igual a la fecha proporcionada
      const filter = {
        fecha_inicio: {
          $gte: filterDate
        }
      };

      const pipeline = [
        { $match: filter }, // Filtra los documentos en la colección de lugares
        {
          $lookup: {
            from: "pelicula", // Nombre de la colección de películas
            localField: "id_pelicula", // Campo en la colección de lugares
            foreignField: "_id", // Campo en la colección de películas
            as: "pelicula", // Nombre del campo resultante que contendrá los datos de la película
          },
        },
        { $unwind: "$pelicula" }, // Desenvuelve el array de la película para obtener un objeto
        {
          $project: {
            // Proyecta los campos específicos que deseas en el resultado final
            titulo: "$pelicula.titulo",
            genero: "$pelicula.genero",
            duracion: "$pelicula.duracion",
            fecha_inicio: 1,
            fecha_fin: 1,
            _id: 0, // Excluye el campo _id del resultado
          },
        },
      ];

      const resultados = await this.collection.aggregate(pipeline).toArray();
      console.log('Resultados obtenidos:', resultados);

      return resultados; // Ejecuta la agregación y retorna el resultado
    } catch (error) {
      console.error(
        "Error obteniendo los lugares con detalles de películas:",
        error
      ); // Manejo de errores
      throw new Error("Error obteniendo los lugares con detalles de películas"); // Lanza un error si ocurre un problema
    }
  }

  /**
   * Filtra lugares por una película específica
   * ? Valores a usar {peliculaId = "66a57941a0881522cdaabb9d"}
   * @param {String} idPelicula - ID de la película para filtrar los lugares
   * @returns {Array} - Lista de lugares con detalles de la película
   */
  async getLugaresByPelicula(idPelicula) {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver los lugares."); //  Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      if (!ObjectId.isValid(idPelicula)) {
        throw new Error("Formato de ObjectId inválido"); // Lanza un error si el formato del ID no es válido
      }

      const peliculaId = new ObjectId(idPelicula); // Convierte el ID a ObjectId

      const pipeline = [
        { $match: { id_pelicula: peliculaId } }, //  Filtra los documentos en la colección de lugares por ID de película
        {
          $lookup: {
            from: "pelicula", //  Nombre de la colección de películas
            localField: "id_pelicula", //  Campo en la colección de lugares
            foreignField: "_id", //  Campo en la colección de películas
            as: "pelicula", //  Nombre del campo resultante que contendrá los datos de la película
          },
        },
        { $unwind: "$pelicula" }, //  Desenvuelve el array de la película para obtener un objeto
        {
          $project: {
            //  Proyecta los campos específicos que deseas en el resultado final
            titulo: "$pelicula.titulo",
            genero: "$pelicula.genero",
            duracion: "$pelicula.duracion",
            sinopsis: "$pelicula.sinopsis",
            fecha_inicio: 1,
            fecha_fin: 1,
            _id: 0, //  Excluye el campo _id del resultado
          },
        },
      ];

      return await this.collection.aggregate(pipeline).toArray(); // Ejecuta la agregación y retorna el resultado
    } catch (error) {
      console.error(
        "Error obteniendo los lugares para la película específica:",
        error
      ); //  Manejo de errores
      throw new Error(
        "Error obteniendo los lugares para la película específica"
      ); //  Lanza un error si ocurre un problema
    }
  }

  /**
   * Agrega un nuevo lugar
   * @param {Object} lugar - Información del lugar a agregar
   * @returns {Object} - Resultado de la operación de inserción
   */
  async addLugar(lugar) {
    if (!this.hasPermission("add")) {
      throw new Error("No tienes permiso para agregar un lugar."); //  Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const res = await this.collection.insertOne(lugar); //  Inserta un nuevo documento en la colección
      return res; //  Retorna el resultado de la inserción
    } catch (error) {
      console.error("Error agregando un lugar: ", error); //  Manejo de errores
      throw new Error("Error agregando un lugar"); //  Lanza un error si ocurre un problema
    }
  }

   /**
   * Actualiza la información de un lugar
   * ? Valores a usar {id: new ObjectId("66a5238f31e93ae393b3e498"),nombre: "Sala 02"}
   * @param {Object} actualizado - Información actualizada del lugar
   * @param {String} actualizado.id - ID del lugar a actualizar
   * @param {Object} actualizado.updateFields - Campos a actualizar
   * @returns {Object} - Resultado de la operación de actualización
   */
  async updateLugar(actualizado) {
    if (!this.hasPermission("update")) {
      throw new Error("No tienes permiso para actualizar el lugar."); // Lanza un error si el usuario no tiene el permiso necesario
    }

    try {
      const { id, ...updateFields } = actualizado; // Destructuración del objeto actualizado
      if (!ObjectId.isValid(id)) {
        throw new Error("Formato de ObjectId inválido"); // Lanza un error si el formato del ID no es válido
      }

      const objectId = new ObjectId(id); // Convierte el ID a ObjectId

      return await this.collection.updateOne(
        // Retorna el resultado de la actualización
        { _id: objectId }, // Filtro para encontrar el lugar por ID
        { $set: updateFields } // Actualiza los campos del lugar
      );
    } catch (error) {
      console.error("Error actualizando el lugar: ", error); // Manejo de errores
      throw new Error("Error actualizando el lugar"); // Lanza un error si ocurre un problema
    }
  }

  /**
   * Elimina un lugar por su ID
   * ? Valores a usar {idlugar = "66a5238f31e93ae393b3e498";}
   * @param {String} id - ID del lugar a eliminar
   * @returns {Object} - Resultado de la operación de eliminación
   */
  async deleteLugar(id) {
    if (!this.hasPermission("delete")) {
      throw new Error("No tienes permiso para eliminar un lugar."); //  Lanza un error si el usuario usado no tiene ese permiso
    }
    try {
      const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null; //  Valida y convierte el ID a ObjectId
      if (!objectId) {
        throw new Error("Invalid ObjectId format"); //  Lanza un error si el formato del ID no es válido
      }
      const res = await this.collection.deleteOne({ _id: objectId }); //  Elimina el documento con el ID especificado
      return res; //  Retorna el resultado de la eliminación
    } catch (error) {
      console.error("Error eliminando un lugar: ", error); //  Manejo de errores
      throw new Error("Error eliminando un lugar"); //  Lanza un error si ocurre un problema
    }
  }
}