const { MongoClient } = require("mongodb");

module.exports = class connect {
  user;
  port;
  #pass;
  #host;
  #dbName;

  /**
   * Constructor de la clase `connect`.
   * Inicializa las variables de configuración de la base de datos utilizando las variables de entorno.
   */
  constructor() {
    this.user = process.env.MONGO_USER;
    this.port = process.env.MONGO_PORT;
    this.#pass = process.env.MONGO_PWD;
    this.#host = process.env.MONGO_HOST;
    this.#dbName = process.env.MONGO_DB;
    this.conexion = null; // Inicialmente null
    this.db = null; // Inicialmente null
  }

  /**
   * Inicializa la conexión a la base de datos MongoDB.
   * Crea una nueva instancia de MongoClient y se conecta a la base de datos si no está ya conectada.
   * @returns {Promise<void>}
   */
  async init() {
    if (!this.conexion) { // Solo abre si no está ya abierta
      const uri = `mongodb://${this.user}:${this.#pass}@${this.#host}:${this.port}/${this.#dbName}?ssl=true&replicaSet=cinecampus-5595-rs0&tlsAllowInvalidCertificates=true`;

      this.conexion = new MongoClient(uri);
      
      await this.conexion.connect();
      this.db = this.conexion.db(this.#dbName);
    }
  }

  /**
   * Obtiene una colección de la base de datos.
   * Lanza un error si la conexión a la base de datos no está inicializada.
   * @param {string} collectionName - Nombre de la colección a obtener.
   * @returns {Collection} - La colección solicitada.
   * @throws {Error} - Lanza un error si la conexión a la base de datos no está inicializada.
   */
  getCollection(collectionName) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    return this.db.collection(collectionName);
  }

  /**
   * Cierra la conexión a la base de datos MongoDB.
   * Establece `conexion` y `db` a null después de cerrar la conexión.
   * @returns {Promise<void>}
   */
  async close() {
    if (this.conexion) {
      await this.conexion.close();
      this.conexion = null;
      this.db = null;
    }
  }
};