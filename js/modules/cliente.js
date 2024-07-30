import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB
import { connect } from "../../helpers/db/conexion.js"; // ? Importa la clase de conexión a la base de datos

//? Repositorio para la colección 'cliente'
export class TarjetaRepository extends connect {
  static instance; // ! Instancia única del repositorio

  constructor() {
    if (typeof TarjetaRepository.instance === "object") {
      return TarjetaRepository.instance; // ! Retorna la instancia existente si ya está creada
    }
    super(); // ? Llama al constructor de la clase base
    this.collection = this.db.collection("cliente"); // ? Inicializa la colección de clientes en la base de datos
    TarjetaRepository.instance = this; // ! Guarda la instancia actual para futuras referencias
    return this; // ! Retorna la instancia del repositorio
  }

  //* Verifica permisos del usuario
  hasPermission(permission) {
    return this.permissions.includes(permission); // ? Retorna el permiso
  }

  //* Verifica cuál es el usuario
  whoUser(users) {
    return this.user.includes(users); //? Retorna el usuario
  }

  //* Crea el usuario en MongoDB y lo guarda en la colección 'cliente'
  async createUser(informacion) {
    if (!this.hasPermission("add") || !this.whoUser("admin")) {
      throw new Error("No tienes permiso para crear un usuario."); // ! Lanza un error si el usuario no tiene el permiso necesario
    }

    const { identificacion, nombre, nick, email, telefono, estado } = informacion;

    //? Crear el usuario en la base de datos MongoDB
    try {
      await this.db.command({
        createUser: nick, //? Usa el apodo como nombre de usuario
        pwd: identificacion, //? Usa la cédula como contraseña
        roles: [{ role: estado, db: process.env.MONGO_DB }] // ? Asigna el rol y la base de datos
      });

      //? Crear el objeto del cliente para la colección 'cliente'
      const cliente = {
        identificacion: parseInt(identificacion), // ? Convierte identificacion a entero
        nombre,
        nick,
        email,
        telefono,
        estado
      };

      //? Insertar el nuevo cliente en la colección 'cliente'
      await this.collection.insertOne(cliente);

      return { message: "Usuario y cliente creados correctamente." };
    } catch (error) {
      console.error("Error creando el usuario:", error);
      throw new Error("Error creando el usuario");
    }
  }
}
