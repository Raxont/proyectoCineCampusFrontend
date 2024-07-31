import { ClienteRepository } from "./js/modules/cliente.js"; // ? Importa el repositorio de tarjeta

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
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
