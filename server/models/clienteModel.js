const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class ClienteModel {
  constructor() {
    this.dbConnection = new connect();
  }

  async init() {
    await this.dbConnection.init(); // Asegúrate de inicializar la conexión
    this.collection = this.dbConnection.getCollection("cliente");
  }

  async findUserByNick(nick) {
    try {
      const user = await this.collection.findOne({ nick: nick });
      return user;
    } catch (error) {
      console.error("Error buscando el nick:", error);
      throw new Error("Error buscando el nick");
    }
  }

  async createUser(informacion) {
    try {
      const { identificacion, nombre, nick, email, telefono, estado } = informacion;
      const clave = identificacion.toString();

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

      const userData = await this.collection.aggregate(pipeline).toArray();

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

  async updateInfoUser(actualizado) {
    try {
      const { identificacion, estado, nick, ...updateFields } = actualizado;
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

      await this.dbConnection.db.command(updateCommand);
      filteredUpdateFields.estado = estado;
      filteredUpdateFields.nick = nick;

      await this.collection.updateOne(
        { identificacion: identificacion },
        { $set: filteredUpdateFields }
      );
    } catch (error) {
      console.error("Error actualizando el usuario:", error);
      throw new Error("Error actualizando el usuario");
    }
  }

  async allUsersRol(rol) {
    try {
      const allUsers = await this.collection.find({ estado: rol }).toArray();
      return allUsers;
    } catch (error) {
      console.error("Error buscando usuarios por rol:", error);
      throw new Error("Error buscando usuarios por rol");
    }
  }
}

module.exports = ClienteModel;
