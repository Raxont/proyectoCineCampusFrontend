const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");


class ClienteModel extends connect {
  constructor() {
    super();
    this.collection = this.db.collection("cliente");
    this.tarjetaCollection = this.db.collection("tarjeta");
  }

  async findUserByNick(nick) {
    await this.reconnect();
    try {
        const user = await this.collection.findOne({ nick: nick });
        return user;
    } catch (error) {
        console.error("Error buscando el nick:", error);
        throw new Error("Error buscando el nick");
    } finally {
        await this.close();
    }
}

  /**
   * Crea un nuevo usuario en MongoDB y lo guarda en la colección 'cliente'
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
    await this.reconnect();
    try {
      const { identificacion, nombre, nick, email, telefono, estado } = informacion;
      
      const clave=identificacion.toString();
      if (estado === "administrador") {
        
        await this.db.command({
          createUser: nick,
          pwd: clave,
          roles: [
            { role: estado, db: process.env.MONGO_DB },
            { role: "userAdminAnyDatabase", db: "admin" },
            { role: "dbAdminAnyDatabase", db: "admin" }
          ],
        });
      } else if (estado === "usuarioEstandar" || estado === "usuarioVip") {
        await this.db.command({
          createUser: nick,
          pwd: clave,
          roles: [{ role: estado, db: process.env.MONGO_DB }],
        });
      }

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
    } finally {
      await this.close();
    }
  }

  /**
   * Busca el usuario por número de identificación y muestra su información junto a su tarjeta
   * @param {String} informacion - Identificación del usuario
   * @returns {Object} - Información del usuario
   */
  async showInfoUser(informacion) {
    await this.reconnect();
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
      const userData = await this.collection.aggregate(pipeline).toArray();
      // Verifica si se obtuvo algún resultado antes de acceder a userData[0]
      if (!userData || userData.length === 0) {
        return null; // Retorna null si no se encontró ningún cliente
      }
      const result = await this.db.command({ usersInfo: 1 });
      const user = result.users.find((user) => user.user === userData[0].nick);
      if (!user) {
        throw new Error("Usuario no encontrado.");
      }
      return userData[0];
    } catch (error) {
      console.error("Error buscando el usuario:", error);
      throw new Error("Error buscando el usuario");
    } finally {
      await this.close();
    }
  }

  /**
   * Actualiza la información del usuario por número de identificación
   * @param {Object} actualizado - Información actualizada del usuario
   * @param {String} actualizado.identificacion - Identificación del usuario
   * @param {String} actualizado.estado - Nuevo estado del usuario
   * @param {String} actualizado.nick - Apodo del usuario
   * @returns {Object} - Resultado de la actualización
   */
  async updateInfoUser(actualizado) {
    await this.reconnect();
    try {
      const { identificacion, estado, nick, ...updateFields } = actualizado;
      // Filtrar campos con valor undefined
      const filteredUpdateFields = Object.fromEntries(
        Object.entries(updateFields).filter(([_, value]) => value !== undefined)
      );

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

      const updateCommand = {
        updateUser: nick,
        roles: [{ role: estado, db: "CineCampus" }],
      };

      await this.db.command(updateCommand);
      filteredUpdateFields.estado = estado;
      filteredUpdateFields.nick = nick;

     await this.collection.updateOne(
        { identificacion: identificacion },
        { $set: filteredUpdateFields }
      );
    } catch (error) {
      console.error("Error actualizando el usuario:", error);
      throw new Error("Error actualizando el usuario");
    } finally {
      await this.close();
    }
  }

  /**
   * Consulta todos los usuarios del sistema, con la posibilidad de filtrar por rol
   * @param {String} rol - Rol a filtrar
   * @returns {Array} - Lista de usuarios filtrados
   */
  async allUsersRol(rol) {
    await this.reconnect();
    try {
      const allUsers = await this.collection.find({ estado: rol }).toArray();
      return allUsers;
    } catch (error) {
      console.error("Error buscando usuarios por rol:", error);
      throw new Error("Error buscando usuarios por rol");
    } finally {
      await this.close();
    }
  }
}

module.exports = ClienteModel;
