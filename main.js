import { TarjetaRepository } from "./js/modules/cliente.js"; // ? Importa el repositorio de tarjeta

//* Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'
async function maintarjetas(action) {
  try {
    const tarjetaRepo = new TarjetaRepository(); //* Crea una instancia del repositorio de tarjeta

    if (action === "create") {
      //* Si la acción es 'create', crea un nuevo usuario.
      const informacion = {
        identificacion: "1234567890", // ? La cédula se usa como identificador del cliente
        nombre: "Carlos Andres",
        nick: "CaAn",
        email: "carlos_andres@gmail.com",
        telefono: ["3139670075"],
        estado: "cliente" // ? Estado del nuevo cliente
      };
      const resultadoCreado = await tarjetaRepo.createUser(informacion);
      console.log("Cliente creado con éxito:", resultadoCreado);
    } else {
      console.log("Acción no válida. Usa 'create'."); //! Esta acción no es válida
    }
  } catch (error) {
    console.error("Error:", error); // ! Manejo de errores
  }
}

const actionTarjeta = "create"; //* Acción por defecto, modifícala según la necesidad
maintarjetas(actionTarjeta); // * Ejecuta la función principal con la acción definida
