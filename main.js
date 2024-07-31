import { ClienteRepository } from "./js/modules/cliente.js"; // ? Importa el repositorio de tarjeta
import { BoletaRepository } from "./js/modules/boleta.js"; // ? Importa el repositorio de boleta
import { LugarRepository } from "./js/modules/lugar.js"; // ? Importa el repositorio de lugar
import { asientoRepository } from "./js/modules/asientos.js"; // ? Importa el repositorio de asiento
import { TarjetaRepository } from "./js/modules/tarjeta.js"; // ? Importa el repositorio de tarjeta

//* Función principal de Lugar que ejecuta diferentes acciones basadas en el parámetro 'action'
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

//* Función principal de Boleta que ejecuta diferentes acciones basadas en el parámetro 'action'
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


//* Función principal de Asientos que ejecuta diferentes acciones basadas en el parámetro 'action'
async function mainAsientos(action) {
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

const actionAsientos = "returnReserva"; //* Acción por defecto el cual debe de ser modificando según la necesidad
mainAsientos(actionAsientos); // * Ejecuta la función principal con la acción definida
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

//* Función principal de Tarjeta que ejecuta diferentes acciones basadas en el parámetro 'action'
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

//* Función principal de Cliente que ejecuta diferentes acciones basadas en el parámetro 'action'
async function mainCliente(action) {
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

const actionCliente = "showUser"; //* Acción por defecto, modifícala según la necesidad
mainCliente(actionCliente); // * Ejecuta la función principal con la acción definida

/**
 *  //* Valor que muestra al ver los usuarios por identificacion incluyendo el estado vip
 * //*  y al agregar un nuevo usuario
 * @returns Usuario de la base de datos:  [
              {
                identificacion: 1234567890,
                nombre: 'Carlos Andres',
                nick: 'CaAn',
                email: 'carlos_andres@gmail.com',
                telefono: [ '3139670075' ],
                estado: 'cliente',
                estado_tarjeta: 'vencido'
              }
            ]
            Usuario de MongoDB {
              _id: 'CineCampus.CaAn',
              userId: new UUID('a354be52-74d8-4e5e-9f69-858ac199c77b'),
              user: 'CaAn',
              db: 'CineCampus',
              roles: [ { role: 'cliente', db: 'CineCampus' } ],
              mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
            }
 */

/**
 *  //* Valor que muestra en la base de datos y mongoDB al actualizar el usuario
 * @returns cliente de la base de datos [ 
              _id:66a9bc1f4897d3289107d935
              identificacion:1234567890
              nombre:"Carlos Andres"
              nick:"CaAn"
              email:"carlos_andres@gmail.com"
              telefono: 0:"3139670075"
              estado:"cliente"
            ]
            tarjeta de la base de datos [ 
              _id:66a9588b5a6b264ba0ae9006
              numero:123456
              fecha_expedicion:2024-07-28T00:00:00.000+00:00
              estado:"vencido"
              identificacion_cliente:1234567890
            ]
 */

/**
 *  //* Valor que muestra al ver los usuarios por rol
 * @returns Usuario de la base de datos por rol clienteVIP [
              {
                identificacion: 1234567890,
                nombre: 'Carlos Andres',
                nick: 'CaAn',
                email: 'carlos_andres@gmail.com',
                telefono: [ '3139670075' ],
                estado: 'clienteVIP'
              }
            ]
            Usuario de MongoDB por rol clienteVIP [
              {
                _id: 'CineCampus.vip',
                userId: new UUID('aff59257-26f6-4c42-a661-3ca3eb51e422'),
                user: 'vip',
                db: 'CineCampus',
                roles: [ [Object] ],
                mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
              }
            ]
 */
