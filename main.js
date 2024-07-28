import { BoletaRepository } from "./js/modules/boleta.js"; // ? Importa el repositorio de boleta
import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
async function main(action) {
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
        fecha_adquisicion: new Date("2024-08-01T12:00:00Z"), // ! Reemplaza con una fecha valida
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
      const boletasConFechaInicio = await boletaRepo.getBoletasConFechaInicio(
        identificacionCliente
      );
      console.log("Boletas por cliente con fecha de inicio:", boletasConFechaInicio); 
    }
    else {
      console.log(
        "Acción no válida. Usa 'getAll', 'add', 'update', 'delete', 'getById', 'getByCliente'." //! Esta acción no es válida
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

const action = "add"; //* Acción por defecto el cual debe de ser modificando según la necesidad
main(action); // * Ejecuta la función principal con la acción definida
