import { TarjetaRepository } from "./js/modules/tarjeta.js"; // ? Importa el repositorio de tarjeta
import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
async function maintarjetas(action) {
  try {
    const tarjetaRepo = new TarjetaRepository(); //* Crea una instancia del repositorio de tarjeta

    if (action === "getDescuento") {
      //* Si la acción es 'getDescuento', permite ver el precio con el descuento si aplica.
      const informacion = {
        idLugar: new ObjectId("66a579bb7b00907fab0aee94"), //! Reemplaza con el ID del lugar
        identificacionCliente: 1234567890 //! Reemplaza con la identificación del cliente
      };
      const resultadoActualizar = await tarjetaRepo.priceDiscount(informacion);
      console.log("Precio con el descuento:", resultadoActualizar);
    } 
    else {
      console.log(
        "Acción no válida. Usa 'getDescuento'." //! Esta acción no es válida
      );
    }
  } catch (error) {
    console.error("Error:", error); // ! Manejo de errores
  }
}

const actionTarjeta = "getDescuento"; //* Acción por defecto el cual debe de ser modificando según la necesidad
maintarjetas(actionTarjeta); // * Ejecuta la función principal con la acción definida
/**
 *  //* Valor que muestra al realizar una reserva de un tarjeta
 * @returns tarjeta actualizado en boleta: 
            _id= "66a804abdf6d8860acf5baf4"
            identificacion_cliente=1234567890
            id_lugar="66a579bb7b00907fab0aee94"
            fecha_adquisicion =2024-07-29T21:07:55.646+00:00
            estado="en_linea"
            id_asiento=Array (empty)
            precio=10
 */