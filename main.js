import { LugarRepository } from "./js/modules/lugar.js"; // ? Importa el repositorio de lugar
import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
async function mains(action) {
  try {
    const lugarRepo = new LugarRepository(); //* Crea una instancia del repositorio de lugar

    if (action === "getAll") {
      //* Si la acción es 'getAll', obtiene todos los lugares por fecha de hoy
      const fechaHoy = new Date(); //? Obtiene la fecha actual
      const lugares = await lugarRepo.getAllLugarByDay(fechaHoy);
      console.log("lugar:", lugares);
    } else if (action === "add") {
      //* Si la acción es 'add', agrega un nuevo lugar
      const nuevolugar = {
        nombre: "Sala 01",
        precio: "12.50",
        fecha_inicio: new Date("2024-08-01T10:00:00Z"),
        fecha_fin: new Date("2024-08-01T12:00:00Z"),
        id_pelicula: new ObjectId("60b8d295f5a551001c3e1234"),
      };

      const resultadoAgregar = await agregarlugar(lugarRepo, nuevolugar);
      console.log("lugar agregado:", resultadoAgregar);
    } else if (action === "update") {
      //* Si la acción es 'update', actualiza la información de un lugar
      const lugarActualizado = {
        id: new ObjectId("66a5238f31e93ae393b3e498"), // ! Reemplaza con el ID del lugar que deseas actualizar
        nombre: "Sala 02", // ! Reemplaza o agrega la informacion que desea agregar
      };
      const resultadoActualizar = await actualizarlugar(
        lugarRepo,
        lugarActualizado
      );
      console.log("lugar actualizado:", resultadoActualizar);
    } else if (action === "delete") {
      //* Si la acción es 'delete', elimina un lugar
      const idlugar = "66a5238f31e93ae393b3e498"; // ! Reemplaza con el ID del lugar que deseas eliminar
      const resultadoEliminar = await eliminarlugar(lugarRepo, idlugar);
      console.log("lugar eliminado:", resultadoEliminar);
    } else {
      console.log(
        "Acción no válida. Usa 'getAll', 'add', 'update' o 'delete'." //! Esta acción no es válida
      );
    }
  } catch (error) {
    console.error("Error:", error); // ! Manejo de errores
  }
}

//* Función para agregar un lugar
async function agregarlugar(lugarRepo, lugar) {
  try {
    const resultado = await lugarRepo.addLugar(lugar);
    return resultado;
  } catch (error) {
    console.error("Error agregando lugar:", error); // ! Manejo de errores al agregar un lugar
  }
}

//* Función para actualizar un lugar
async function actualizarlugar(lugarRepo, actualizado) {
  try {
    const resultado = await lugarRepo.updateLugar(actualizado);
    return resultado;
  } catch (error) {
    console.error("Error actualizando lugar:", error); // ! Manejo de errores al actualizar un lugar
  }
}
//* Función para eliminar un lugar
async function eliminarlugar(lugarRepo, id) {
  try {
    const resultado = await lugarRepo.deleteLugar(id);
    return resultado;
  } catch (error) {
    console.error("Error eliminando lugar:", error); // ! Manejo de errores al eliminar un lugar
  }
}

const action = ""; //* Acción por defecto el cual debe de ser modificando segun la necesidad
mains(action); // * Ejecuta la función principal con la acción definida
/**
 *  //* Valor que muestra en la base de datos al agregar un nuevo lugar
 * @returns lugar: [
            {
            nombre: "Sala 01",
            precio: "12.50",
            fecha_inicio: new Date("2023-07-01T10:00:00Z"),
            fecha_fin: new Date("2023-07-01T12:00:00Z"),
            id_pelicula: new ObjectId("60b8d295f5a551001c3e1234")
            }
            ]
 */

/**
 *  //* Valor que muestra en la base de datos al actualizar un lugar existente
 * @returns lugar: [
            {
            nombre: "Sala 02", //? El nombre de la sala modificada cambia a ser Sala 02 
            precio: "12.50",
            fecha_inicio: new Date("2023-07-01T10:00:00Z"),
            fecha_fin: new Date("2023-07-01T12:00:00Z"),
            id_pelicula: new ObjectId("60b8d295f5a551001c3e1234")
            }
            ]
 */
