const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class ClienteModel {
  /**
   * Constructor de la clase `ClienteModel`.
   * Inicializa la conexión a la base de datos.
   */
  constructor() {
    this.dbConnection = new connect();
  }

  /**
   * Inicializa la conexión a la base de datos y obtiene la colección de clientes.
   * @returns {Promise<void>}
   */
  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("cliente");
  }

  /**
   * Encuentra un usuario por su nombre de usuario (nick).
   * @param {string} nick - Nombre de usuario del cliente.
   * @returns {Promise<Object|null>} - Usuario encontrado o null si no se encuentra.
   */
  async findUserByNick(nick) {
    try {
      const user = await this.collection.findOne({ nick: nick });
      return user;
    } catch (error) {
      console.error("Error buscando el nick:", error);
      throw new Error("Error buscando el nick");
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos y en MongoDB.
   * @param {Object} informacion - Información del usuario a crear.
   * @param {Number} informacion.identificacion - Identificación del cliente.
   * @param {string} informacion.nombre - Nombre del cliente.
   * @param {string} informacion.nick - Nombre de usuario del cliente.
   * @param {string} informacion.email - Correo electrónico del cliente.
   * @param {string} informacion.telefono - Teléfono del cliente.
   * @param {string} informacion.estado - Estado del usuario (administrador, usuarioEstandar, usuarioVip).
   * @returns {Promise<void>}
   */
  async createUser(informacion) {
    try {
      const { identificacion, nombre, nick, email, telefono, estado } = informacion;
      const clave = identificacion.toString();

      // Crea el usuario en MongoDB con los roles adecuados según su estado
      if (estado === "administrador") {
        await this.dbConnection.db.command({
          createUser: nick,
          pwd: clave,
          roles: [
            { role: estado, db: process.env.MONGO_DB },
            { role: "userAdminAnyDatabase", db: "admin" },
            { role: "dbAdminAnyDatabase", db: "admin" }
          ],
        });
      } else if (estado === "usuarioEstandar" || estado === "usuarioVip") {
        await this.dbConnection.db.command({
          createUser: nick,
          pwd: clave,
          roles: [{ role: estado, db: process.env.MONGO_DB }],
        });
      }

      // Inserta el cliente en la colección de clientes
      const cliente = {
        identificacion: parseInt(identificacion),
        nombre,
        nick,
        email,
        telefono,
        estado,
      };

      await this.collection.insertOne(cliente);
    } catch (error) {
      console.error("Error creando el usuario:", error);
      throw new Error("Error creando el usuario");
    }
  }

  /**
   * Muestra la información de un usuario, incluyendo su estado de tarjeta.
   * @param {Number|string} [informacion] - Identificación del cliente para filtrar, si se proporciona.
   * @returns {Promise<Object|null>} - Datos del usuario o null si no se encuentra.
   */
  async showInfoUser(informacion) {
    try {
      const filter = informacion ? { identificacion: { $eq: informacion } } : {};
      const pipeline = [
        { $match: filter },
        {
          $lookup: {
            from: "tarjeta",
            localField: "identificacion",
            foreignField: "identificacion_cliente",
            as: "tarjetas",
          },
        },
        { $unwind: "$tarjetas" },
        {
          $project: {
            _id: 0,
            identificacion: 1,
            nombre: 1,
            nick: 1,
            email: 1,
            telefono: 1,
            estado: 1,
            estado_tarjeta: "$tarjetas.estado",
          },
        },
      ];

      const userData = await this.collection.aggregate(pipeline).toArray(); // Ejecuta el pipeline de agregación para obtener datos del usuario

      if (!userData || userData.length === 0) {
        return null;
      }

      const result = await this.dbConnection.db.command({ usersInfo: 1 });
      const user = result.users.find((user) => user.user === userData[0].nick);

      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      return userData[0];
    } catch (error) {
      console.error("Error buscando el usuario:", error);
      throw new Error("Error buscando el usuario");
    }
  }

  /**
   * Actualiza la información de un usuario, incluyendo su estado y rol.
   * @param {Object} actualizado - Datos actualizados del usuario.
   * @param {Number} actualizado.identificacion - Identificación del cliente.
   * @param {string} actualizado.estado - Nuevo estado del usuario.
   * @param {string} actualizado.nick - Nombre de usuario del cliente.
   * @param {Object} [actualizado.updateFields] - Otros campos a actualizar.
   * @returns {Promise<void>}
   */
  async updateInfoUser(actualizado) {
    try {
      const { identificacion, estado, nick, ...updateFields } = actualizado;
      const filteredUpdateFields = Object.fromEntries(
        Object.entries(updateFields).filter(([_, value]) => value !== undefined)
      );

      // Actualiza el estado de la tarjeta según el nuevo estado del usuario
      if (estado === "usuarioEstandar") {
        await this.tarjetaCollection.updateOne(
          { identificacion_cliente: identificacion },
          { $set: { estado: "vencido" } }
        );
      } else if (estado === "usuarioVip") {
        await this.tarjetaCollection.updateOne(
          { identificacion_cliente: identificacion },
          { $set: { estado: "activo" } }
        );
      }

      // Actualiza el usuario en MongoDB con el nuevo rol
      const updateCommand = {
        updateUser: nick,
        roles: [{ role: estado, db: "CineCampus" }],
      };

      await this.dbConnection.db.command(updateCommand);
      filteredUpdateFields.estado = estado;
      filteredUpdateFields.nick = nick;

      // Actualiza el usuario en la colección de clientes
      await this.collection.updateOne(
        { identificacion: identificacion },
        { $set: filteredUpdateFields }
      );
    } catch (error) {
      console.error("Error actualizando el usuario:", error);
      throw new Error("Error actualizando el usuario");
    }
  }

  /**
   * Obtiene todos los usuarios con un rol específico.
   * @param {string} rol - Rol de los usuarios a buscar.
   * @returns {Promise<Array>} - Array con los usuarios encontrados.
   */
  async allUsersRol(rol) {
    try {
      const allUsers = await this.collection.find({ estado: rol }).toArray(); // Busca usuarios con el rol especificado
      return allUsers;
    } catch (error) {
      console.error("Error buscando usuarios por rol:", error);
      throw new Error("Error buscando usuarios por rol");
    }
  }
}

module.exports = ClienteModel;
