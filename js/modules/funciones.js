import { ClienteRepository } from "./cliente.js"; // ? Importa el repositorio de tarjeta
import { BoletaRepository } from "./boleta.js"; // ? Importa el repositorio de boleta
import { LugarRepository } from "./lugar.js"; // ? Importa el repositorio de lugar
import { asientoRepository } from "./asientos.js"; // ? Importa el repositorio de asiento
import { TarjetaRepository } from "./tarjeta.js"; // ? Importa el repositorio de tarjeta
import { ObjectId } from "mongodb"; // ? Importa el constructor de ObjectId de MongoDB

//* Función principal de Lugar que ejecuta diferentes acciones basadas en el parámetro 'action'
export async function mainLugar(action) {
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

//* Función principal de Boleta que ejecuta diferentes acciones basadas en el parámetro 'action'
export async function mainBoleta(action) {
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
        "Acción no válida. Usa 'getAll', 'add', 'update', 'delete', 'getByCliente', 'getAsientos'." //! Esta acción no es válida
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

//* Función principal de Asientos que ejecuta diferentes acciones basadas en el parámetro 'action'
export async function mainAsientos(action) {
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

//* Función principal de Tarjeta que ejecuta diferentes acciones basadas en el parámetro 'action'
export async function mainTarjetas(action) {
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

//* Función principal de Cliente que ejecuta diferentes acciones basadas en el parámetro 'action'
export async function mainCliente(action) {
  try {
    const tarjetaRepo = new ClienteRepository(); //* Crea una instancia del repositorio de tarjeta

    if (action === "create") {
      //* Si la acción es 'create', crea un nuevo usuario.
      const informacion = {
        identificacion: "1234567890", // ? La cédula se usa como identificador del cliente
        nombre: "Carlos Andres",
        nick: "CaAn",
        email: "carlos_andres@gmail.com",
        telefono: ["3139670075"],
        estado: "cliente", // ? Rol que puede tener el cliente
      };
      const resultadoCreado = await tarjetaRepo.createUser(informacion);
      console.log("Cliente creado con éxito:", resultadoCreado);
    } else if (action === "showUser") {
      //* Si la acción es 'showUser', muestra un usuario especifico junto a su tarjeta si aplica.
      const informacion = 1234567890; //! Modifica la identificacion segun desee buscar el cliente
      const resultadoCreado = await tarjetaRepo.showInfoUser(informacion);
    } else if (action === "updateUser") {
      //* Si la acción es 'updateUser', actualiza un nuevo usuario.
      const informacion = {
        identificacion: 1234567890,
        estado: "cliente", // ? Rol que puede tener el cliente
        nick: "CaAn", //? Nick al cual va a actualizar la informacion
      };
      const resultadoCreado = await tarjetaRepo.UpdateInfoUser(informacion);
      console.log(resultadoCreado);
    } else if (action === "allRol") {
      //* Si la acción es 'allRol', muestra todos los usuarios por rol.
      await tarjetaRepo.AllUsersRol("cliente"); //! Modifica el rol segun desee filtrar
    } else {
      console.log(
        "Acción no válida. Usa 'create' , 'showUser' , 'updateUser' , 'allRol'."
      ); //! Esta acción no es válida
    }
  } catch (error) {
    console.error("Error:", error); // ! Manejo de errores
  }
}
