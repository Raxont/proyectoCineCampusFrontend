const { ObjectId } = require("mongodb");
const connect = require("../infrastructure/database/conexion");

class BoletaModel extends connect {
  constructor() {
    super();
    this.collection = this.db.collection("boleta");
    this.asientosCollection = this.db.collection("asientos");
  }

  async getAllBoletas() {
    await this.reconnect();
    const resultados = await this.collection.find({}).toArray();
    await this.close();
    return resultados;
  }

  async getBoletasByCliente(identificacion_cliente) {
    await this.reconnect();
    const identificacion = +identificacion_cliente;
   
    // Definir el pipeline de agregación
    const pipeline = [
        // Filtro por identificación del cliente
        { $match: { identificacion_cliente: identificacion } },

        // Unir con la colección 'asientos'
        {
            $lookup: {
                from: 'asientos', // Nombre de la colección de asientos
                localField: 'id_asiento',
                foreignField: '_id',
                as: 'asientos'
            }
        },
        { $unwind: '$asientos' },

        // Unir con la colección 'lugares'
        {
            $lookup: {
                from: 'lugar', // Nombre de la colección de lugares
                localField: 'id_lugar',
                foreignField: '_id',
                as: 'lugar'
            }
        },
        { $unwind: '$lugar' },

        // Unir con la colección 'peliculas'
        {
            $lookup: {
                from: 'pelicula', // Nombre de la colección de películas
                localField: 'lugar.id_pelicula',
                foreignField: '_id',
                as: 'pelicula'
            }
        },
        { $unwind: '$pelicula' },

        // Proyección de los campos deseados
        {
            $project: {
                _id: 1,
                estado: 1,
                fecha_adquisicion: 1,
                precio: 1,
                asientos: {
                    tipo_fila: '$asientos.tipo_fila',
                    codigo: '$asientos.codigo',
                    incremento: '$asientos.incremento'
                },
                lugar: {
                    nombre: '$lugar.nombre',
                    precio: '$lugar.precio',
                    fecha_inicio: '$lugar.fecha_inicio',
                    fecha_fin: '$lugar.fecha_fin'
                },
                pelicula: {
                    titulo: '$pelicula.titulo',
                    img: '$pelicula.img'
                }
            }
        }
    ];

    const resultados = await this.collection.aggregate(pipeline).toArray();
    console.log("Resultados: " ,resultados)
    await this.close();
    return resultados;
}

  async getAsientosAvailable(id_lugar) {
    await this.reconnect();

    const resultados = await this.asientosCollection.aggregate([
      { $match: { id_lugar: new ObjectId(id_lugar) } },
      { $project: { id_lugar: 0 ,_id:0} }
    ]).toArray();
    
    
    await this.close();
    return resultados;
  }

  async addBoleta(boletaData) {
    await this.reconnect();
    const result = await this.collection.insertOne(boletaData);
    await this.close();
    return result;
  }

  async updateBoleta(id, updatedData) {
    await this.reconnect();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: updatedData };

    const result = await this.collection.updateOne(filter, update);
    await this.close();
    return result;
  }

  async deleteBoleta(id) {
    await this.reconnect();
    const filter = { _id: new ObjectId(id) };

    const result = await this.collection.deleteOne(filter);
    await this.close();
    return result;
  }
}

module.exports = BoletaModel;
