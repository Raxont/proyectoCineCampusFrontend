import { MongoClient } from "mongodb";

export class connect{
    user;
    port;
    #pass;
    #host;
    #cluster;
    #dbName;
    permissions;

   static instance
   constructor()
   {
       if(typeof connect.instance === "object"){
           return connect.instance;
       }
       this.user = process.env.MONGO_USER;
       this.port = process.env.MONGO_PORT;
       this.#pass = process.env.MONGO_PWD;
       this.#host = process.env.MONGO_HOST;
       this.#cluster = process.env.MONGO_CLUSTER;
       this.#dbName = process.env.MONGO_DB;
       this.permissions = (process.env.USER_PERMISSIONS || "").split(",");
       this.#open();
       this.db = this.conexion.db(this.getDbName)
       connect.instance = this;
       return this;
   }
   set setPass(pass){
       this.#pass = pass
   }
   set setHost(host){
       this.#host = host
   }
   set setCluster(cluster){
       this.#cluster = cluster
   }
   set setDbName(dbName){
       this.#dbName = dbName
   }
   get getPass(){
       return this.#pass
   }
   get getHost(){
       return this.#host
   }
   get getCluster(){
       return this.#cluster
   }
   get getDbName(){
       return this.#dbName
   }
   async #open(){
       this.conexion = new MongoClient(`${this.getHost}${this.user}:${this.getPass}@${this.getCluster}:${this.port}/`);
       await this.conexion.connect();
   }
   async reconnect(){
       await this.#open();
   }
   async close(){
       await this.conexion.close();
   }
}