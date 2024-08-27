const  {MongoClient} = require("mongodb"); // ? Importa el cliente de MongoDB

module.exports = class connect {
  user; // ? Usuario para la conexión a la base de datos
  port; // ? Puerto para la conexión a la base de datos
  #pass; // ? Contraseña para la conexión a la base de datos (privada)
  #host; // ? Host para la conexión a la base de datos (privada)
  #cluster; // ? Cluster para la conexión a la base de datos (privada)
  #dbName; // ? Nombre de la base de datos (privada)
  permissions; // ? Permisos del usuario

  static instance; // ! Instancia única de la clase

  constructor() {
    if (connect.instance) {
        return connect.instance;
    }
    this.user = process.env.MONGO_USER;
    this.port = process.env.MONGO_PORT;
    this.#pass = process.env.MONGO_PWD;
    this.#host = process.env.MONGO_HOST;
    this.#cluster = process.env.MONGO_CLUSTER;
    this.#dbName = process.env.MONGO_DB;
    connect.instance = this;
    return this;
  }

  getCollection(collectionName) {
    if (!this.db) {
        throw new Error("Database connection is not initialized.");
    }
    return this.db.collection(collectionName);
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
    this.conexion = new MongoClient(`${this.getHost}${this.user}:${this.getPass}@${this.getCluster}:${this.port}/${this.getDbName}`);
    await this.conexion.connect();
    this.db = this.conexion.db(this.getDbName); // Asigna db después de la conexión
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