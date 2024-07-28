import { MongoClient } from "mongodb"; // ? Importa el cliente de MongoDB

export class connect {
  user; // ? Usuario para la conexión a la base de datos
  port; // ? Puerto para la conexión a la base de datos
  #pass; // ? Contraseña para la conexión a la base de datos (privada)
  #host; // ? Host para la conexión a la base de datos (privada)
  #cluster; // ? Cluster para la conexión a la base de datos (privada)
  #dbName; // ? Nombre de la base de datos (privada)
  permissions; // ? Permisos del usuario

  static instance; // ! Instancia única de la clase

  constructor() {
    if (typeof connect.instance === "object") {
      return connect.instance; // ! Retorna la instancia existente si ya está creada
    }
    this.user = process.env.MONGO_USER; // ? Asigna el usuario desde las variables de entorno
    this.port = process.env.MONGO_PORT; // ? Asigna el puerto desde las variables de entorno
    this.#pass = process.env.MONGO_PWD; // ? Asigna la contraseña desde las variables de entorno
    this.#host = process.env.MONGO_HOST; // ? Asigna el host desde las variables de entorno
    this.#cluster = process.env.MONGO_CLUSTER; // ? Asigna el cluster desde las variables de entorno
    this.#dbName = process.env.MONGO_DB; // ? Asigna el nombre de la base de datos desde las variables de entorno
    this.permissions = (process.env.USER_PERMISSIONS || "").split(","); // ? Asigna los permisos del usuario desde las variables de entorno
    this.#open(); // * Abre la conexión a la base de datos
    this.db = this.conexion.db(this.getDbName); // ? Asigna la base de datos a la conexión
    connect.instance = this; // ! Guarda la instancia actual para futuras referencias
    return this; // ! Retorna la instancia de la clase
  }

  //* Setter para la contraseña
  set setPass(pass) {
    this.#pass = pass;
  }

  //* Setter para el host
  set setHost(host) {
    this.#host = host;
  }

  //* Setter para el cluster
  set setCluster(cluster) {
    this.#cluster = cluster;
  }

  //* Setter para el nombre de la base de datos
  set setDbName(dbName) {
    this.#dbName = dbName;
  }

  //* Getter para la contraseña
  get getPass() {
    return this.#pass;
  }

  //* Getter para el host
  get getHost() {
    return this.#host;
  }

  //* Getter para el cluster
  get getCluster() {
    return this.#cluster;
  }

  //* Getter para el nombre de la base de datos
  get getDbName() {
    return this.#dbName;
  }

  //* Abre la conexión a la base de datos
  async #open() {
    this.conexion = new MongoClient(`${this.getHost}${this.user}:${this.getPass}@${this.getCluster}:${this.port}/${this.getDbName}`); // ? Crea una nueva instancia de MongoClient con la URI de conexión
    await this.conexion.connect(); // ? Establece la conexión con la base de datos
  }

  //* Reconecta a la base de datos
  async reconnect() {
    await this.#open();
  }

  //* Cierra la conexión a la base de datos
  async close() {
    await this.conexion.close();
  }
}

