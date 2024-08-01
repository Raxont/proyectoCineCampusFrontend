import { ClienteRepository } from "./cliente.js"; //  Importa el repositorio de tarjeta
import { BoletaRepository } from "./boleta.js"; //  Importa el repositorio de boleta
import { LugarRepository } from "./lugar.js"; //  Importa el repositorio de lugar
import { asientoRepository } from "./asientos.js"; //  Importa el repositorio de asiento
import { TarjetaRepository } from "./tarjeta.js"; //  Importa el repositorio de tarjeta
import { ObjectId } from "mongodb"; //  Importa el constructor de ObjectId de MongoDB

/**
 * Ejecuta acciones relacionadas con los lugares del repositorio según la acción especificada
 * ? Valores a usar {action: "getAllByDate" | "add" | "update" | "delete" | "getByPelicula"}
 * @param {String} action - La acción que se desea realizar con los lugares
 * @returns {void}
 */
export async function mainLugar(action) {
  try {
    const lugarRepo = new LugarRepository(); // Crea una instancia del repositorio de lugar
    if (action === "getAllByDate") {
        /**
       * Si la acción es 'getAllByDate', obtiene todos los lugares por fecha de hoy
       * ? Se obtiene la fecha actual para la consulta
       * @type {Date} fechaHoy - Fecha actual para la consulta
       * @returns {Array} - Lista de lugares por fecha
       */
      const fechaHoy = new Date(); // Obtiene la fecha actual
      const lugares = await lugarRepo.getAllLugarWithPeliculaByDay(fechaHoy);
      console.log("lugar por fecha:", lugares);
    } else if (action === "add") {
        /**
       * Si la acción es 'add', agrega un nuevo lugar
       * ? Valores a usar {nombre: "Sala 03", precio: "10.50", fecha_inicio: new Date("2024-09-01T12:00:00Z"), fecha_fin: new Date("2024-09-01T14:00:00Z"), id_pelicula: new ObjectId("66a57941a0881522cdaabb98")}
       * @type {Object} nuevolugar - Información del nuevo lugar
       * @param {String} nombre - Nombre del lugar
       * @param {String} precio - Precio del lugar
       * @param {Date} fecha_inicio - Fecha de inicio
       * @param {Date} fecha_fin - Fecha de fin
       * @param {ObjectId} id_pelicula - ID de la película
       * @returns {Object} - Resultado de la operación de agregar el lugar
       */
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
      /**
       * Si la acción es 'update', actualiza la información de un lugar
       * ? Valores a usar {id: new ObjectId("66a5238f31e93ae393b3e498"), nombre: "Sala 02"}
       * @type {Object} lugarActualizado - Información del lugar a actualizar
       * @param {ObjectId} id - ID del lugar a actualizar
       * @param {String} nombre - Nuevo nombre del lugar
       * @returns {Object} - Resultado de la operación de actualización del lugar
       */
      const lugarActualizado = {
        id: new ObjectId("66a5238f31e93ae393b3e498"), //  Reemplaza con el ID del lugar que deseas actualizar
        nombre: "Sala 02" //  Reemplaza o agrega la informacion que desea agregar
      };
      const resultadoActualizar = await actualizarlugar(
        lugarRepo,
        lugarActualizado
      );
      console.log("lugar actualizado:", resultadoActualizar);
    } else if (action === "delete") {
      /**
       * Si la acción es 'delete', elimina un lugar
       * ? Valores a usar {id: "66a5238f31e93ae393b3e498"}
       * @type {String} idlugar - ID del lugar a eliminar
       * @returns {Object} - Resultado de la operación de eliminación del lugar
       */
      const idlugar = "66a5238f31e93ae393b3e498"; //  Reemplaza con el ID del lugar que deseas eliminar
      const resultadoEliminar = await eliminarlugar(lugarRepo, idlugar);
      console.log("lugar eliminado:", resultadoEliminar);
    } else if (action === "getByPelicula") {
      /**
      * Si la acción es 'getByPelicula', obtiene lugares por una película específica
      * ? Valores a usar {peliculaId: "66a57941a0881522cdaabb9d"}
      * @type {String} peliculaId - ID de la película para la búsqueda de lugares
      * @returns {Array} - Lista de lugares por película
      */
      const peliculaId = "66a57941a0881522cdaabb9d"; //  Reemplaza con el ID de la pelicula que deseas buscar
      const lugares = await lugarRepo.getLugaresByPelicula(peliculaId);
      console.log("lugares por película:", lugares);
    } else {
      console.log(
        "Acción no válida. Usa 'getAllByDate', 'add', 'update' , 'delete' , 'getByPelicula'." // Esta acción no es válida
      );
    }
  } catch (error) {
    console.error("Error:", error); //  Manejo de errores
  }
}

/**
 * Permite agregar un nuevo lugar al repositorio
 * ? Valores a usar {nombre: "Sala 03", precio: "10.50", fecha_inicio: new Date("2024-09-01T12:00:00Z"), fecha_fin: new Date("2024-09-01T14:00:00Z"), id_pelicula: new ObjectId("66a57941a0881522cdaabb98")}
 * @param {LugarRepository} lugarRepo - Repositorio de lugares
 * @param {Object} lugar - Información del lugar a agregar
 * @param {String} lugar.nombre - Nombre del lugar
 * @param {String} lugar.precio - Precio del lugar
 * @param {Date} lugar.fecha_inicio - Fecha de inicio
 * @param {Date} lugar.fecha_fin - Fecha de fin
 * @param {ObjectId} lugar.id_pelicula - ID de la película
 * @returns {Object} - Resultado de la operación de agregar el lugar
 */
async function agregarlugar(lugarRepo, lugar) {
  try {
    const resultado = await lugarRepo.addLugar(lugar);
    return resultado;
  } catch (error) {
    console.error("Error agregando lugar:", error); //  Manejo de errores al agregar un lugar
  }
}

/**
 * Permite actualizar la información de un lugar existente
 * ? Valores a usar {id: new ObjectId("66a5238f31e93ae393b3e498"), nombre: "Sala 02"}
 * @param {LugarRepository} lugarRepo - Repositorio de lugares
 * @param {Object} actualizado - Información actualizada del lugar
 * @param {ObjectId} actualizado.id - ID del lugar a actualizar
 * @param {String} actualizado.nombre - Nuevo nombre del lugar
 * @returns {Object} - Resultado de la operación de actualización del lugar
 */
async function actualizarlugar(lugarRepo, actualizado) {
  try {
    const resultado = await lugarRepo.updateLugar(actualizado);
    return resultado;
  } catch (error) {
    console.error("Error actualizando lugar:", error); //  Manejo de errores al actualizar un lugar
  }
}

/**
 * Permite eliminar un lugar existente del repositorio
 * ? Valores a usar {id: "66a5238f31e93ae393b3e498"}
 * @param {LugarRepository} lugarRepo - Repositorio de lugares
 * @param {String} id - ID del lugar a eliminar
 * @returns {Object} - Resultado de la operación de eliminación del lugar
 */
async function eliminarlugar(lugarRepo, id) {
  try {
    const resultado = await lugarRepo.deleteLugar(id);
    return resultado;
  } catch (error) {
    console.error("Error eliminando lugar:", error); //  Manejo de errores al eliminar un lugar
  }
}

/**
 * Ejecuta acciones relacionadas con las boletas del repositorio según la acción especificada
 * ? Valores a usar {action: "getAll" | "add" | "update" | "delete" | "getByCliente" | "getAsientos"}
 * @param {String} action - La acción que se desea realizar con las boletas
 * @returns {void}
 */
export async function mainBoleta(action) {
  try {
    const boletaRepo = new BoletaRepository(); // Crea una instancia del repositorio de boleta

    if (action === "getAll") {
      /**
       * Si la acción es 'getAll', obtiene todas las boletas
       * @returns {Array} - Lista de todas las boletas
       */
      const boletas = await boletaRepo.getAllboleta();
      console.log("Boletas:", boletas);
    } 
    else if (action === "add") {
      /**
       * Si la acción es 'add', agrega una nueva boleta
       * ? Valores a usar {identificacion_cliente: 1234567890, id_lugar: new ObjectId("66a579bb7b00907fab0aee94"), fecha_adquisicion: new Date(), estado: "en_linea", id_asiento: []}
       * @type {Object} nuevaBoleta - Información de la nueva boleta
       * @param {Number} identificacion_cliente - Identificación del cliente (10 dígitos)
       * @param {ObjectId} id_lugar - ID del lugar
       * @param {Date} fecha_adquisicion - Fecha de adquisición
       * @param {String} estado - Estado de la boleta (solo 'en_linea' o 'fisico')
       * @param {Array} id_asiento - Lista de IDs de asientos (vacía en el caso de nueva boleta)
       * @returns {Object} - Resultado de la operación de agregar la boleta
       */
      const nuevaBoleta = {
        identificacion_cliente: 1234567890,// Solo es permitido un minimo y un maximo de 10 digitos
        id_lugar: new ObjectId("66a579bb7b00907fab0aee94"), //  Reemplaza con ObjectId válidos de la base de datos
        fecha_adquisicion: new Date(), //  Reemplaza con una fecha valida
        estado: "en_linea", // Solo es permitido 'en_linea', 'fisico'
        id_asiento: []
      };
      const resultadoAgregar = await agregarBoleta(boletaRepo, nuevaBoleta);
      console.log("Boleta agregada:", resultadoAgregar);
    } 
    else if (action === "update") {
      /**
       * Si la acción es 'update', actualiza la información de una boleta
       * ? Valores a usar {id: new ObjectId("66a5238f31e93ae393b3e498"), estado: "fisico"}
       * @type {Object} boletaActualizada - Información de la boleta a actualizar
       * @param {ObjectId} id - ID de la boleta a actualizar
       * @param {String} estado - Nuevo estado de la boleta
       * @returns {Object} - Resultado de la operación de actualización de la boleta
       */
      const boletaActualizada = {
        id: new ObjectId("66a5238f31e93ae393b3e498"), //  Reemplaza con el ID de la boleta que deseas actualizar
        estado: "fisico", //  Reemplaza o agrega la información que desea actualizar
      };
      const resultadoActualizar = await actualizarBoleta(
        boletaRepo,
        boletaActualizada
      );
      console.log("Boleta actualizada:", resultadoActualizar);
    } 
    else if (action === "delete") {
      /**
       * Si la acción es 'delete', elimina una boleta
       * ? Valores a usar {id: "66a5238f31e93ae393b3e498"}
       * @type {String} idBoleta - ID de la boleta a eliminar
       * @returns {Object} - Resultado de la operación de eliminación de la boleta
       */
      const idBoleta = "66a5238f31e93ae393b3e498"; // Reemplaza con el ID de la boleta que deseas eliminar
      const resultadoEliminar = await eliminarBoleta(boletaRepo, idBoleta);
      console.log("Boleta eliminada:", resultadoEliminar);
    } 
    else if (action === "getByCliente") {
      /**
       * Si la acción es 'getByCliente', obtiene boletas por identificación de cliente y trae la fecha de inicio de cada lugar
       * ? Valores a usar {identificacionCliente: 1234567890}
       * @type {Number} identificacionCliente - Identificación del cliente para la búsqueda de boletas
       * @returns {Array} - Lista de boletas con fecha de inicio de cada lugar
       */
      const identificacionCliente = 1234567890; //  Reemplaza con la identificación del cliente que deseas buscar
      const boletasConFechaInicio = await boletaRepo.getBoletasWithFecha_Inicio(
        identificacionCliente
      );
      console.log("Boletas por cliente con fecha de inicio:", boletasConFechaInicio); 
    }
    else if (action === "getAsientos") {
       /**
       * Si la acción es 'getAsientos', permite la consulta de la disponibilidad de asientos en una sala para una proyección específica
       * ? Valores a usar {idLugar: new ObjectId("66a579bb7b00907fab0aee94")}
       * @type {ObjectId} idLugar - ID del lugar para la búsqueda de asientos disponibles
       * @returns {Array} - Lista de asientos disponibles en el lugar especificado
       */
      const idLugar = new ObjectId("66a579bb7b00907fab0aee94"); //  Reemplaza con la identificación del lugar que deseas buscar asientos disponibles
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

/**
 * Permite agregar una nueva boleta al repositorio
 * ? Valores a usar {identificacion_cliente: 1234567890, id_lugar: new ObjectId("66a579bb7b00907fab0aee94"), fecha_adquisicion: new Date(), estado: "en_linea", id_asiento: []}
 * @param {BoletaRepository} boletaRepo - Repositorio de boletas
 * @param {Object} boleta - Información de la boleta a agregar
 * @param {Number} boleta.identificacion_cliente - Identificación del cliente
 * @param {ObjectId} boleta.id_lugar - ID del lugar
 * @param {Date} boleta.fecha_adquisicion - Fecha de adquisición
 * @param {String} boleta.estado - Estado de la boleta
 * @param {Array} boleta.id_asiento - Lista de IDs de asientos reservados
 * @returns {Object} - Resultado de la operación de agregar la boleta
 */
async function agregarBoleta(boletaRepo, boleta) {
  try {
    const resultado = await boletaRepo.addboleta(boleta);
    return resultado;
  } catch (error) {
    console.error("Error agregando boleta:", error); //  Manejo de errores al agregar una boleta
  }
}

/**
 * Permite actualizar la información de una boleta existente
 * ? Valores a usar {id: new ObjectId("66a5238f31e93ae393b3e498"), estado: "fisico"}
 * @param {BoletaRepository} boletaRepo - Repositorio de boletas
 * @param {Object} actualizado - Información actualizada de la boleta
 * @param {ObjectId} actualizado.id - ID de la boleta a actualizar
 * @param {String} actualizado.estado - Nuevo estado de la boleta
 * @returns {Object} - Resultado de la operación de actualización de la boleta
 */
async function actualizarBoleta(boletaRepo, actualizado) {
  try {
    const resultado = await boletaRepo.updateboleta(actualizado);
    return resultado;
  } catch (error) {
    console.error("Error actualizando boleta:", error); //  Manejo de errores al actualizar una boleta
  }
}

/**
 * Permite eliminar una boleta existente del repositorio
 * ? Valores a usar {id: "66a5238f31e93ae393b3e498"}
 * @param {BoletaRepository} boletaRepo - Repositorio de boletas
 * @param {String} id - ID de la boleta a eliminar
 * @returns {Object} - Resultado de la operación de eliminación de la boleta
 */
async function eliminarBoleta(boletaRepo, id) {
  try {
    const resultado = await boletaRepo.deleteboleta(id);
    return resultado;
  } catch (error) {
    console.error("Error eliminando boleta:", error); //  Manejo de errores al eliminar una boleta
  }
}

/**
 * Ejecuta acciones relacionadas con los asientos del repositorio según la acción especificada
 * ? Valores a usar {action: "getReserva" | "returnReserva"}
 * @param {String} action - La acción que se desea realizar con los asientos
 * @returns {void}
 */
export async function mainAsientos(action) {
  try {
    const asientoRepo = new asientoRepository(); // Crea una instancia del repositorio de asiento

    if (action === "getReserva") {
      /**
       * Si la acción es 'getReserva', permite la selección y reserva de asientos.
       * ? Valores a usar {idAsiento: new ObjectId("66a6d3fa1c9570011db88fdb"), idLugar: new ObjectId("66a579bb7b00907fab0aee94"), identificacionCliente: 1234567890}
       * @type {Object} informacion - Información para reservar el asiento
       * @param {ObjectId} idAsiento - ID del asiento a reservar
       * @param {ObjectId} idLugar - ID del lugar donde se encuentra el asiento
       * @param {Number} identificacionCliente - Identificación del cliente que realiza la reserva
       * @returns {Object} - Resultado de la operación de actualización del asiento en la boleta
       */
      const informacion = {
        idAsiento: new ObjectId("66a6d3fa1c9570011db88fdb"), // Reemplaza con el ID del asiento
        idLugar: new ObjectId("66a579bb7b00907fab0aee94"), // Reemplaza con el ID del lugar
        identificacionCliente: 1234567890 // Reemplaza con la identificación del cliente
      };
      const resultadoActualizar = await asientoRepo.updateAsientoInBoleta(informacion);
      console.log("Asiento actualizado en boleta:", resultadoActualizar);
    } 
    else if (action === "returnReserva") {
      /**
       * Si la acción es 'returnReserva', cancela una reserva de asiento ya realizada
       * ? Valores a usar {idAsiento: new ObjectId("66a6d3fa1c9570011db88fdb"), idLugar: new ObjectId("66a579bb7b00907fab0aee94"), identificacionCliente: 1234567890}
       * @type {Object} informacion - Información para cancelar la reserva del asiento
       * @param {ObjectId} idAsiento - ID del asiento cuya reserva se desea cancelar
       * @param {ObjectId} idLugar - ID del lugar donde se encuentra el asiento
       * @param {Number} identificacionCliente - Identificación del cliente que realizó la reserva
       * @returns {Object} - Resultado de la operación de reversión del asiento en la boleta
       */
      const informacion = {
        idAsiento: new ObjectId("66a6d3fa1c9570011db88fdb"), // Reemplaza con el ID del asiento
        idLugar: new ObjectId("66a579bb7b00907fab0aee94"), // Reemplaza con el ID del lugar
        identificacionCliente: 1234567890 // Reemplaza con la identificación del cliente
      };
      const resultadoActualizar = await asientoRepo.revertAsientoInBoleta(informacion);
      console.log("Asiento actualizado en boleta:", resultadoActualizar);
    } 
    else {
      console.log(
        "Acción no válida. Usa 'getReserva', 'returnReserva'." // Esta acción no es válida
      );
    }
  } catch (error) {
    console.error("Error:", error); //  Manejo de errores
  }
}

/**
 * Ejecuta acciones relacionadas con las tarjetas del repositorio según la acción especificada
 * ? Valores a usar {action: "getDescuento"}
 * @param {String} action - La acción que se desea realizar con las tarjetas
 * @returns {void}
 */
export async function mainTarjetas(action) {
  try {
    const tarjetaRepo = new TarjetaRepository(); // Crea una instancia del repositorio de tarjeta

    if (action === "getDescuento") {
      /**
       * Si la acción es 'getDescuento', permite ver el precio con el descuento si aplica.
       * ? Valores a usar {idLugar: new ObjectId("66a579bb7b00907fab0aee94"), identificacionCliente: 1234567890}
       * @type {Object} informacion - Información para calcular el precio con descuento
       * @param {ObjectId} idLugar - ID del lugar para el cual se desea obtener el descuento
       * @param {Number} identificacionCliente - Identificación del cliente para verificar si aplica descuento
       * @returns {Object} - Precio con el descuento aplicado
       */
      const informacion = {
        idLugar: new ObjectId("66a579bb7b00907fab0aee94"), // Reemplaza con el ID del lugar
        identificacionCliente: 1234567890 // Reemplaza con la identificación del cliente
      };
      const resultadoActualizar = await tarjetaRepo.priceDiscount(informacion);
      console.log("Precio con el descuento:", resultadoActualizar);
    } 
    else {
      console.log(
        "Acción no válida. Usa 'getDescuento'." // Esta acción no es válida
      );
    }
  } catch (error) {
    console.error("Error:", error); //  Manejo de errores
  }
}

/**
 * Ejecuta acciones relacionadas con los clientes del repositorio según la acción especificada
 * ? Valores a usar {action: "create", "showUser", "updateUser", "allRol"}
 * @param {String} action - La acción que se desea realizar con los clientes
 * @returns {void}
 */
export async function mainCliente(action) {
  try {
    const tarjetaRepo = new ClienteRepository(); // Crea una instancia del repositorio de tarjeta

    if (action === "create") {
      /**
       * Si la acción es 'create', crea un nuevo usuario.
       * ? Valores a usar {identificacion: "1234567890", nombre: "Carlos Andres", nick: "CaAn", email: "carlos_andres@gmail.com", telefono: ["3139670075"], estado: "cliente"}
       * @type {Object} informacion - Información para crear un nuevo cliente
       * @param {String} identificacion - Cédula del cliente, se usa como identificador
       * @param {String} nombre - Nombre completo del cliente
       * @param {String} nick - Apodo o nombre corto del cliente
       * @param {String} email - Correo electrónico del cliente
       * @param {Array<String>} telefono - Lista de números de teléfono del cliente
       * @param {String} estado - Rol del cliente (ej. 'cliente')
       * @returns {Object} - Información del cliente creado
       */
      const informacion = {
        identificacion: "1234567890", //  La cédula se usa como identificador del cliente
        nombre: "Carlos Andres",
        nick: "CaAn",
        email: "carlos_andres@gmail.com",
        telefono: ["3139670075"],
        estado: "cliente" //  Rol que puede tener el cliente
      };
      const resultadoCreado = await tarjetaRepo.createUser(informacion);
      console.log("Cliente creado con éxito:", resultadoCreado);
    } else if (action === "showUser") {
      /**
       * Si la acción es 'showUser', muestra un usuario específico junto a su tarjeta si aplica.
       * ? Valores a usar {identificacion: 1234567890}
       * @param {Number} identificacion - Identificación del cliente a mostrar
       * @returns {void}
       */
      await tarjetaRepo.showInfoUser(1234567890);// Modifica la identificacion segun desee buscar el cliente
    } else if (action === "updateUser") {
      /**
       * Si la acción es 'updateUser', actualiza la información de un usuario.
       * ? Valores a usar {identificacion: 1234567890, estado: "cliente", nick: "CaAn"}
       * @type {Object} informacion - Información para actualizar un cliente
       * @param {Number} identificacion - Identificación del cliente a actualizar
       * @param {String} estado - Nuevo rol del cliente
       * @param {String} nick - Nuevo apodo o nombre corto del cliente
       * @returns {Object} - Información actualizada del cliente
       */
      const informacion = {
        identificacion: 1234567890,
        estado: "cliente", //  Rol que puede tener el cliente
        nick: "CaAn" // Nick al cual va a actualizar la informacion
      };
      const resultadoCreado = await tarjetaRepo.UpdateInfoUser(informacion);
      console.log(resultadoCreado);
    } else if (action === "allRol") {
      /**
       * Si la acción es 'allRol', muestra todos los usuarios por rol.
       * ? Valores a usar {rol: "cliente"}
       * @param {String} rol - Rol para filtrar los usuarios
       * @returns {void}
       */
      await tarjetaRepo.AllUsersRol("cliente"); // Modifica el rol segun desee filtrar
    } else {
      console.log(
        "Acción no válida. Usa 'create' , 'showUser' , 'updateUser' , 'allRol'."
      ); // Esta acción no es válida
    }
  } catch (error) {
    console.error("Error:", error); //  Manejo de errores
  }
}
