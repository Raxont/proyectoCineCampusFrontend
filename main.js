import { LugarRepository } from "./js/modules/lugar.js"; // ? Importa el repositorio de lugar
import { BoletaRepository } from "./js/modules/boleta.js"; // ? Importa el repositorio de boleta
import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
async function mainLugar(action) {
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

const actionLugar = "getByPelicula"; //* Acción por defecto el cual debe de ser modificando segun la necesidad
mainLugar(actionLugar); // * Ejecuta la función principal con la acción definida
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

            

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
async function mainBoleta(action) {
  try {
    const boletaRepo = new BoletaRepository(); //* Crea una instancia del repositorio de boleta

    if (action === "getAll") {
      //* Si la acción es 'getAll', obtiene todas las boletas
      const boletas = await boletaRepo.getAllboleta();
      console.log("Boletas:", boletas);
    } 
    else if (action === "add") {
      //* Si la acción es 'add', agrega una nueva boleta
      const nuevaBoleta = {
        identificacion_cliente: 1234567890,//! Solo es permitido un minimo y un maximo de 10 digitos
        id_lugar: new ObjectId("66a579bb7b00907fab0aee94"), // ! Reemplaza con ObjectId válidos de la base de datos
        fecha_adquisicion: new Date(), // ! Reemplaza con una fecha valida
        estado: "en_linea", //! Solo es permitido 'en_linea', 'fisico'
        id_asiento: []
      };
      const resultadoAgregar = await agregarBoleta(boletaRepo, nuevaBoleta);
      console.log("Boleta agregada:", resultadoAgregar);
    } 
    else if (action === "update") {
      //* Si la acción es 'update', actualiza la información de una boleta
      const boletaActualizada = {
        id: new ObjectId("66a5238f31e93ae393b3e498"), // ! Reemplaza con el ID de la boleta que deseas actualizar
        estado: "fisico", // ! Reemplaza o agrega la información que desea actualizar
      };
      const resultadoActualizar = await actualizarBoleta(
        boletaRepo,
        boletaActualizada
      );
      console.log("Boleta actualizada:", resultadoActualizar);
    } 
    else if (action === "delete") {
      //* Si la acción es 'delete', elimina una boleta
      const idBoleta = "66a5238f31e93ae393b3e498"; // ! Reemplaza con el ID de la boleta que deseas eliminar
      const resultadoEliminar = await eliminarBoleta(boletaRepo, idBoleta);
      console.log("Boleta eliminada:", resultadoEliminar);
    } 
    else if (action === "getById") {
      //* Si la acción es 'getById', obtiene una boleta por ID
      const idBoleta = "66a5238f31e93ae393b3e498"; // ! Reemplaza con el ID de la boleta que deseas obtener
      const boleta = await boletaRepo.getboletaById(new ObjectId(idBoleta));
      console.log("Boleta por ID:", boleta);
    } 
    else if (action === "getByCliente") {
      //* Si la acción es 'getByCliente', obtiene boletas por identificación de cliente y trae la fecha de inicio de cada lugar
      const identificacionCliente = 1234567890; // ! Reemplaza con la identificación del cliente que deseas buscar
      const boletasConFechaInicio = await boletaRepo.getBoletasWithFecha_Inicio(
        identificacionCliente
      );
      console.log("Boletas por cliente con fecha de inicio:", boletasConFechaInicio); 
    }
    else if (action === "getAsientos") {
      //* Si la acción es 'getAsientos', permite la consulta de la disponibilidad de asientos en una sala para una proyección específica
      const idLugar = new ObjectId("66a579bb7b00907fab0aee94"); // ! Reemplaza con la identificación del lugar que deseas buscar asientos disponibles
      const boletasConFechaInicio = await boletaRepo.getAsientosAvailable(
        idLugar
      );
      console.log("Asientos disponibles:", boletasConFechaInicio); 
    }
    else {
      console.log(
        "Acción no válida. Usa 'getAll', 'add', 'update', 'delete', 'getById', 'getByCliente', 'getAsientos'." //! Esta acción no es válida
      );
    }
  } catch (error) {
    console.error("Error:", error); // ! Manejo de errores
  }
}

//* Función para agregar una boleta
async function agregarBoleta(boletaRepo, boleta) {
  try {
    const resultado = await boletaRepo.addboleta(boleta);
    return resultado;
  } catch (error) {
    console.error("Error agregando boleta:", error); // ! Manejo de errores al agregar una boleta
  }
}

//* Función para actualizar una boleta
async function actualizarBoleta(boletaRepo, actualizado) {
  try {
    const resultado = await boletaRepo.updateboleta(actualizado);
    return resultado;
  } catch (error) {
    console.error("Error actualizando boleta:", error); // ! Manejo de errores al actualizar una boleta
  }
}

//* Función para eliminar una boleta
async function eliminarBoleta(boletaRepo, id) {
  try {
    const resultado = await boletaRepo.deleteboleta(id);
    return resultado;
  } catch (error) {
    console.error("Error eliminando boleta:", error); // ! Manejo de errores al eliminar una boleta
  }
}

const actionBoleta = "getAsientos"; //* Acción por defecto el cual debe de ser modificando según la necesidad
mainBoleta(actionBoleta); // * Ejecuta la función principal con la acción definida
/**
 *  //* Valor que muestra las boletas por identificación de cliente
 * @returns Boletas por cliente con fecha de inicio: [
              {
                identificacion_cliente: 1234567890,
                id_lugar: new ObjectId('66a579bb7b00907fab0aee94'),
                fecha_adquisicion: 2024-07-29T21:07:55.646Z,
                estado: 'en_linea',
                id_asiento: [],
                fechaHora_pelicula: 2024-08-01T10:00:00.000Z
              }
            ]
 */

/**
 *  //* Valor que muestra la disponibilidad de asientos en una sala
 * @returns Asientos disponibles: [
              {
                _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                tipo_fila: 'premier',
                codigo: 'A01',
                incremento: 10
              },
              {
                _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                tipo_fila: 'premier',
                codigo: 'A02',
                incremento: 10
              },
              {
                _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                tipo_fila: 'premier',
                codigo: 'A03',
                incremento: 10
              },
              {
                _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                tipo_fila: 'general',
                codigo: 'B01',
                incremento: 0
              },
              {
                _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                tipo_fila: 'general',
                codigo: 'B02',
                incremento: 0
              },
              {
                _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                tipo_fila: 'general',
                codigo: 'B03',
                incremento: 0
              }
            ]
 */