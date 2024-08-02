const  {ObjectId}  = require("mongodb"); //  Importa el constructor de ObjectId de MongoDB
const  connect  = require("../../helpers/db/conexion"); //  Importa la clase de conexión a la base de datos

// Repositorio para la colección 'tarjeta'
module.exports = class TarjetaRepository extends connect {
  static instance; //  Instancia única del repositorio

  constructor() {
    if (typeof TarjetaRepository.instance === "object") {
      return TarjetaRepository.instance; //  Retorna la instancia existente si ya está creada
    }
    super(); //  Llama al constructor de la clase base
    this.collection = this.db.collection("tarjeta"); //  Inicializa la colección de tarjetas en la base de datos
    TarjetaRepository.instance = this; //  Guarda la instancia actual para futuras referencias
    return this; //  Retorna la instancia del repositorio
  }

  /**
   * Verifica si el usuario tiene el permiso especificado
   * @param {String} permission - Permiso requerido
   * @returns {Boolean} - Retorna verdadero si el usuario tiene el permiso
   */
  hasPermission(permission) {
    return this.permissions.includes(permission); //  Retorna el permiso
  }

  /**
   * Verifica la validez de una tarjeta VIP y aplica el descuento a su compra
   * ? Valores a usar {idLugar: new ObjectId("66a579bb7b00907fab0aee94"),identificacionCliente: 1234567890}
   * @param {Object} informacion - Información para aplicar el descuento
   * @param {String} informacion.idLugar - ID del lugar
   * @param {String} informacion.identificacionCliente - Identificación del cliente
   * @returns {Object} - Mensaje y detalles del descuento aplicado
   */
  async priceDiscount(informacion) {
    const { idLugar, identificacionCliente } = informacion; // Desestructura el objeto 'informacion'

    if (!this.hasPermission("view")) {
      throw new Error("No tienes permiso para ver la tarjeta."); //  Lanza un error si el usuario no tiene el permiso necesario
    }

    if (!ObjectId.isValid(idLugar)) {
      throw new Error("Formato de ObjectId inválido"); //  Lanza un error si el formato del ID no es válido
    }

    const objectIdLugar = new ObjectId(idLugar); // Guarda el objeto idLugar en una constante

    try {
      // Verifica si el cliente existe en la colección de tarjeta y si el estado de la tarjeta está activo
      const tarjeta = await this.collection.findOne({
        identificacion_cliente: identificacionCliente,
        estado: "activo"
      });

      // Obtiene el precio del idLugar de la colección de lugares
      const lugar = await this.db.collection("lugar").findOne({ _id: objectIdLugar });

      if (!lugar) {
        throw new Error("Lugar no encontrado."); //  Lanza un error si el lugar no es encontrado
      }

      const precioOriginal = lugar.precio; // Guarda el precio original en una constante
      let precioConDescuento = precioOriginal; // Guarda el mismo precio en una variable para aplicar el descuento o no

      if (tarjeta) {
        const descuento = 0.20; //  Define el descuento para tarjeta VIP
        precioConDescuento = precioOriginal * (1 - descuento); //  Calcula el precio con descuento
      }

      // Aplica el precio (con o sin descuento) en la boleta
      const resultadoBoleta = await this.db.collection("boleta").updateOne(
        { identificacion_cliente: identificacionCliente },
        { $set: { precio: precioConDescuento } }
      );

      console.log(`Precio original: ${precioOriginal}, Precio aplicado: ${precioConDescuento}`); //  Log del precio original y el aplicado

      return { // Retorna el mensaje si fue correcta la operacion
        message: "Precio actualizado correctamente.",
        detalles: {
          precioOriginal,
          precioConDescuento,
          resultadoBoleta
        }
      };

    } catch (error) {
      console.error("Error actualizando el precio:", error); //  Lanza un error en caso de fallo en la actualización
      throw new Error("Error actualizando el precio");
    }
  }
}