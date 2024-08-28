const { MongoClient } = require("mongodb");

module.exports = class connect {
  user; 
  port; 
  #pass; 
  #host; 
  #cluster; 
  #dbName; 

  constructor() {
    this.user = process.env.MONGO_USER;
    this.port = process.env.MONGO_PORT;
    this.#pass = process.env.MONGO_PWD;
    this.#host = process.env.MONGO_HOST;
    this.#cluster = process.env.MONGO_CLUSTER;
    this.#dbName = process.env.MONGO_DB;
    this.conexion = null; // Inicialmente null
    this.db = null; // Inicialmente null
  }

  async init() {
    if (!this.conexion) { // Solo abre si no está ya abierta
      this.conexion = new MongoClient(
        `${this.#host}${this.user}:${this.#pass}@${this.#cluster}:${this.port}/${this.#dbName}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
      await this.conexion.connect();
      this.db = this.conexion.db(this.#dbName);
    }
  }

  getCollection(collectionName) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    return this.db.collection(collectionName);
  }

  async close() {
    if (this.conexion) {
      await this.conexion.close();
      this.conexion = null;
      this.db = null;
    }
  }
}
