import { LugarRepository } from "./js/modules/lugar.js"; // ? Importa el repositorio de lugar
import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
async function main(action) {
  try {
    const lugarRepo = new LugarRepository(); //* Crea una instancia del repositorio de lugar

    if (action === "getAllByDate") {
      //* Si la acción es 'getAllByDate', obtiene todos los lugares por fecha de hoy
      const fechaHoy = new Date(); //? Obtiene la fecha actual
      const lugares = await lugarRepo.getAllLugarWithPeliculaByDay(fechaHoy);
      console.log("lugar por fecha:", lugares);
    } else if (action === "add") {
      //* Si la acción es 'add', agrega un nuevo lugar
      const nuevolugar = {
        nombre: "Sala 03",
        precio: "10.50",
        fecha_inicio: new Date("2024-09-01T12:00:00Z"),
        fecha_fin: new Date("2024-09-01T14:00:00Z"),
        id_pelicula: new ObjectId("66a57941a0881522cdaabb98"),
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
    } else if (action === "getByPelicula") {
      //* Si la acción es 'getByPelicula', obtiene lugares por una película específica
      const peliculaId = "66a57941a0881522cdaabb9d"; // ! Reemplaza con el ID de la pelicula que deseas buscar
      const lugares = await lugarRepo.getLugaresByPelicula(peliculaId);
      console.log("lugares por película:", lugares);
    } else {
      console.log(
        "Acción no válida. Usa 'getAllByDate', 'add', 'update' , 'delete' , 'getByPelicula'." //! Esta acción no es válida
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

const action = "getByPelicula"; //* Acción por defecto el cual debe de ser modificando segun la necesidad
main(action); // * Ejecuta la función principal con la acción definida
/**
 *  //* Valor que muestra al filtrar por dia
 * @returns lugar por fecha: [
            {
                fecha_inicio: 2024-08-01T10:00:00.000Z,
                fecha_fin: 2024-08-01T12:00:00.000Z,
                titulo: 'La gran aventura',
                genero: [ 'Acción', 'Aventura' ],
                duracion: 120,
                sinopsis: 'En un mundo lleno de peligros, un héroe debe emprender una misión para salvar a su pueblo.'
            }
            ]
 */

/**
 *  //* Valor que muestra al filtrar por pelicula
 * @returns lugar por pelicula: [
            {
                fecha_inicio: 2023-07-01T10:00:00.000Z,
                fecha_fin: 2023-07-01T12:00:00.000Z,
                titulo: 'La gran aventura',
                genero: [ 'Acción', 'Aventura' ],
                duracion: 120,
                sinopsis: 'En un mundo lleno de peligros, un héroe debe emprender una misión para salvar a su pueblo.'
            },
            {
                fecha_inicio: 2024-08-01T10:00:00.000Z,
                fecha_fin: 2024-08-01T12:00:00.000Z,
                titulo: 'La gran aventura',
                genero: [ 'Acción', 'Aventura' ],
                duracion: 120,
                sinopsis: 'En un mundo lleno de peligros, un héroe debe emprender una misión para salvar a su pueblo.'
            }
            ]
 */
