import { ObjectId } from "mongodb"; // Importa el constructor de ObjectId de MongoDB
import { connect } from "../../helpers/db/conexion.js"; // Importa la clase de conexión a la base de datos
import validator from "validator"; // Importa la librería validator

// Repositorio para la colección 'cliente'
export class ClienteRepository extends connect {
  static instance; //  Instancia única del repositorio

  constructor() {
    if (typeof ClienteRepository.instance === "object") {
      return ClienteRepository.instance; // Retorna la instancia existente si ya está creada
    }
    super(); // Llama al constructor de la clase base
    this.collection = this.db.collection("cliente"); // Inicializa la colección de clientes en la base de datos
    ClienteRepository.instance = this; // Guarda la instancia actual para futuras referencias
    return this; // Retorna la instancia del repositorio
  }

  /**
   * Verifica si el usuario tiene el permiso especificado
   * @param {String} permission - Permiso requerido
   * @returns {Boolean} - Retorna verdadero si el usuario tiene el permiso
   */
  hasPermission(permission) {
    return this.permissions.includes(permission); // Retorna el permiso
  }

  /**
   * Crea el usuario en MongoDB y lo guarda en la colección 'cliente'
   * ? Valores a usar {identificacion: "1234567890", nombre: "Carlos Andres", nick: "CaAn", email: "carlos_andres@gmail.com", telefono: ["3139670075"], estado: "cliente"}
   * @param {Object} informacion - Información del usuario a crear
   * @param {String} informacion.identificacion - Identificación del usuario
   * @param {String} informacion.nombre - Nombre del usuario
   * @param {String} informacion.nick - Apodo del usuario
   * @param {String} informacion.email - Email del usuario
   * @param {Array} informacion.telefono - Teléfonos del usuario
   * @param {String} informacion.estado - Rol del usuario
   * @returns {Object} - Mensaje de éxito
   */
  async createUser(informacion) {
    if (!this.hasPermission("add")) {
      throw new Error("No tienes permiso para crear un usuario."); //  Lanza un error si el usuario no tiene el permiso necesario
    }

    const { identificacion, nombre, nick, email, telefono, estado } =
      informacion;
    // Valida el correo electrónico
    if (!validator.isEmail(email)) {
      throw new Error("El correo electrónico ingresado no es válido.");
    }

    // Crear el usuario en la base de datos MongoDB
    try {
      if (estado==="administrador"){
        await this.db.command({
          createUser: nick, // Usa el apodo como nombre de usuario
          pwd: identificacion, // Usa la cédula como contraseña
          roles: [{ role: estado, db: process.env.MONGO_DB },
            { role: "userAdminAnyDatabase", db: "admin" },
            { role: "dbAdminAnyDatabase", db: "admin" }], //  Asigna el rol y la base de datos
        });
      }else if(estado==="usuarioEstandar"||estado==="usuarioVip"){
        await this.db.command({
          createUser: nick, // Usa el apodo como nombre de usuario
          pwd: identificacion, // Usa la cédula como contraseña
          roles: [{ role: estado, db: process.env.MONGO_DB }], //  Asigna el rol y la base de datos
        });
      }
      

      // Crear el objeto del cliente para la colección 'cliente'
      const cliente = {
        identificacion: parseInt(identificacion), //  Convierte identificacion a entero
        nombre,
        nick,
        email,
        telefono,
        estado,
      };

      // Insertar el nuevo cliente en la colección 'cliente'
      await this.collection.insertOne(cliente);

      return { message: "Usuario y cliente creados correctamente." };
    } catch (error) {
      console.error("Error creando el usuario:", error);
      throw new Error("Error creando el usuario");
    }
  }

   /**
   * Busca el usuario por número de identificación y muestra su información junto a su tarjeta
   * ? Valores a usar {informacion:1234567890}
   * @param {String} informacion - Identificación del usuario
   * @returns {void}
   */
  async showInfoUser(informacion) {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para buscar un usuario."); //  Lanza un error si el usuario no tiene el permiso necesario
    }
    // Busca el usuario en la base de datos
    try {
      const filter = informacion
        ? { identificacion: { $eq: informacion } }
        : {}; //  Filtra por numero de identificacion
      const pipeline = [
        { $match: filter }, //  Filtra los documentos en la colección de cliente
        {
          $lookup: {
            from: "tarjeta", //  Nombre de la colección de tarjeta
            localField: "identificacion", //  Campo en la colección de cliente
            foreignField: "identificacion_cliente", //  Campo en la colección de tarjeta
            as: "tarjetas", //  Nombre del campo resultante que contendrá los datos de la tarjeta
          },
        },
        { $unwind: "$tarjetas" }, //  Desenvuelve el array de la película para obtener un objeto
        {
          $project: {
            //  Proyecta los campos específicos que desea en el resultado final
            _id: 0, // Excluye el campo _id del resultado
            identificacion: 1, // Incluye el campo
            nombre: 1, // Incluye el campo
            nick: 1, // Incluye el campo
            email: 1, // Incluye el campo
            telefono: 1, // Incluye el campo
            estado: 1, // Incluye el campo
            estado_tarjeta: "$tarjetas.estado", // Incluye el campo agregado
          },
        },
      ];
      const userData = await this.collection.aggregate(pipeline).toArray();
      console.log("Usuario de la base de datos: ", userData);
      const result = await this.db.command({ usersInfo: 1 }); //? Obtiene información de todos los usuarios
      //* Filtra el usuario específico en el código
      const user = result.users.find((user) => user.user === userData[0].nick);
      if (!user) {
        throw new Error("Usuario no encontrado.");
      }
      console.log("Usuario de MongoDB", user);
    } catch (error) {
      console.error("Error buscando el usuario:", error);
      throw new Error("Error buscando el usuario");
    }
  }

  /**
   * Actualiza la información del usuario por número de identificación
   * ? Valores que uso {identificacion: 1234567890,estado: "cliente",nick: "CaAn"}
   * @param {Object} actualizado - Información actualizada del usuario
   * @param {String} actualizado.identificacion - Identificación del usuario
   * @param {String} actualizado.estado - Nuevo estado del usuario
   * @param {String} actualizado.nick - Apodo del usuario
   * @returns {Object} - Resultado de la actualización
   */
  async UpdateInfoUser(actualizado) {
    if (!this.hasPermission("update")) {
      throw new Error("No tienes permiso para actualizar un usuario."); //  Lanza un error si el usuario no tiene el permiso necesario
    }
    // Actualiza el usuario en la base de datos
    try {
      const { identificacion, estado, nick, ...updateFields } = actualizado; // Destructuración del objeto actualizado
      if (!identificacion && !nick) {
        throw new Error(
          "Se requiere una identificacion de usuario y un nick para actualizar."
        );
      }
      if (estado === "usuarioEstandar") {
        // Actualiza la informacion de la tarjeta en vencido
        await this.db
          .collection("tarjeta")
          .updateOne(
            { identificacion_cliente: identificacion },
            { $set: { estado: "vencido" } }
          );
      } else if (estado === "usuarioVip") {
        // Actualiza la informacion de la tarjeta en activo
        await this.db
          .collection("tarjeta")
          .updateOne(
            { identificacion_cliente: identificacion },
            { $set: { estado: "activo" } }
          );
      }
      // Prepara el comando de actualización
      const updateCommand = {
        updateUser: nick,
        roles: [
          {
            role: estado,
            db: "CineCampus",
          },
        ],
      }; // Se actualiza la informacion del usuario en MongoDB

      // Ejecuta el comando de actualización
      console.log(await this.db.command(updateCommand));
      updateFields.estado = estado; // Guarda la informacion en updateFields
      updateFields.nick = nick; // Guarda la informacion en updateFields
      return await this.collection.updateOne(
        // Retorna el resultado de la actualización
        { identificacion: identificacion }, // Filtro para encontrar el usuario por identificacion
        { $set: updateFields } // Actualiza los campos del usuario
      );
    } catch (error) {
      console.error("Error buscando el usuario:", error);
      throw new Error("Error buscando el usuario"); //  Manejo de errores
    }
  }

  /**
   * Consulta todos los usuarios del sistema, con la posibilidad de filtrar por rol
   * ? Valores a usar {"cliente"}
   * @param {String} rol - Rol a filtrar
   * @returns {void}
   */
  async AllUsersRol(rol) {
    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para actualizar un usuario."); //  Lanza un error si el usuario no tiene el permiso necesario
    }
    // Actualiza el usuario en la base de datos
    try {
      const AllUsers = await this.collection.find({ estado: rol }).toArray();
      console.log(`Usuario de la base de datos por rol ${rol}`, AllUsers);
    } catch (error) {
      console.error("Error buscando el usuario:", error);
      throw new Error("Error buscando el usuario"); //  Manejo de errores
    }
    const result = await this.db.command({ usersInfo: 1 }); // Obtiene información de todos los usuarios
    // Filtra el usuario específico en el código
    const usuariosConRol = result.users.filter((user) =>
      user.roles.some((role) => role.role === rol)
    );
    if (usuariosConRol.length === 0) {
      throw new Error("No se encontraron usuarios con el rol especificado.");
    }
    console.log(`Usuario de MongoDB por rol ${rol}`, usuariosConRol);
  }
}