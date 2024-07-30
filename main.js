import { asientoRepository } from "./js/modules/asientos.js"; // ? Importa el repositorio de asiento
import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
async function main(action) {
  try {
    const asientoRepo = new asientoRepository(); //* Crea una instancia del repositorio de asiento

    if (action === "getReserva") {
      //* Si la acción es 'getReserva', permite la selección y reserva de asientos.
      const informacion = {
        idAsiento: new ObjectId("66a6d3fa1c9570011db88fdb"), //! Reemplaza con el ID del asiento
        idLugar: new ObjectId("66a579bb7b00907fab0aee94"), //! Reemplaza con el ID del lugar
        identificacionCliente: 1234567890 //! Reemplaza con la identificación del cliente
      };
      const resultadoActualizar = await asientoRepo.updateAsientoInBoleta(informacion);
      console.log("Asiento actualizado en boleta:", resultadoActualizar);
    } 
    else if (action === "returnReserva") {
      //* Si la acción es 'return', cancela una reserva de asiento ya realizada
      const informacion = {
        idAsiento: new ObjectId("66a6d3fa1c9570011db88fdb"), //! Reemplaza con el ID del asiento
        idLugar: new ObjectId("66a579bb7b00907fab0aee94"), //! Reemplaza con el ID del lugar
        identificacionCliente: 1234567890 //! Reemplaza con la identificación del cliente
      };
      const resultadoActualizar = await asientoRepo.revertAsientoInBoleta(informacion);
      console.log("Asiento actualizado en boleta:", resultadoActualizar);
    } 
    else {
      console.log(
        "Acción no válida. Usa 'getReserva', 'returnReserva'." //! Esta acción no es válida
      );
    }
  } catch (error) {
    console.error("Error:", error); // ! Manejo de errores
  }
}

const action = "returnReserva"; //* Acción por defecto el cual debe de ser modificando según la necesidad
main(action); // * Ejecuta la función principal con la acción definida
/**
 *  //* Valor que muestra al realizar una reserva de un asiento
 * @returns Asiento actualizado en boleta: {
              message: 'Asiento actualizado correctamente en la boleta.',
              movimientos: {
                asiento: 'idLugar 66a579bb7b00907fab0aee94 eliminado de idAsiento 66a6d3fa1c9570011db88fdb',
                boleta: 'idAsiento 66a6d3fa1c9570011db88fdb agregado a la boleta del cliente 1234567890'    
              }
            }
 */

/**
 *  //* Valor que muestra al cancelar una reserva de un asiento
 * @returns Asiento actualizado en boleta: {
              message: 'Asiento revertido correctamente en la boleta.',
              movimientos: {
                asiento: 'idLugar 66a579bb7b00907fab0aee94 agregado a idAsiento 66a6d3fa1c9570011db88fdb',
                boleta: 'idAsiento 66a6d3fa1c9570011db88fdb eliminado de la boleta del cliente 1234567890'
              }
            }
 */