const { validationResult } = require("express-validator");
const BoletaModel = require("../models/boletaModel");
const BoletaDTO = require("../dto/boletaDto");
const { ObjectId } = require("mongodb");
const path = require("path");

/**
 * Controlador para manejar las solicitudes relacionadas con boletas.
 * Verifica y valida la solicitud y ejecuta las acciones correspondientes basadas en la URL y método HTTP.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const BoletaAPIController = async (req, res) => {
  const errors = validationResult(req); // Valida los datos del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
  }

  const { identificacionCliente, idLugar, idBoleta } = req.query;
  const boletaData = req.body;
  const boletaDto = new BoletaDTO();
  const boletaModel = new BoletaModel();

  try {
    await boletaModel.init(); // Inicializa el modelo de boleta

    // Validar existencia del identificacionCliente
    if (identificacionCliente && !/^\d+$/.test(identificacionCliente)) {
      return res.status(400).json(boletaDto.templateInvalidId()); // Retorna error si la identificación del cliente no es válida
    }

    // Convertir idLugar e idBoleta en ObjectId si están presentes
    let lugarId = null;
    let boletaId = null;

    if (idLugar && !ObjectId.isValid(idLugar)) {
      return res.status(400).json(boletaDto.templateInvalidId()); // Retorna error si idLugar no es válido
    } else if (idLugar) {
      lugarId = new ObjectId(idLugar); // Convierte idLugar a ObjectId
    }

    if (idBoleta && !ObjectId.isValid(idBoleta)) {
      return res.status(400).json(boletaDto.templateInvalidId()); // Retorna error si idBoleta no es válido
    } else if (idBoleta) {
      boletaId = new ObjectId(idBoleta); // Convierte idBoleta a ObjectId
    }

    if (req.url.includes("boletasPorCliente")) {
      // Obtener boletas por cliente
      const resultados = await boletaModel.getBoletasByCliente(identificacionCliente);
      if (resultados.length > 0) {
        return res.status(200).json(boletaDto.templateSuccess(resultados)); // Retorna boletas si existen
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound()); // Retorna error si no se encuentran boletas
      }

    } else if (req.url.includes("getBoletasByClienteAndLugar")) {
      // Obtener boleta por cliente y id lugar
      const resultados = await boletaModel.getBoletasByClienteAndLugar(identificacionCliente, idLugar);
      if (resultados.length > 0) {
        return res.status(200).json(boletaDto.templateSuccess(resultados)); // Retorna boletas si existen
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound()); // Retorna error si no se encuentran boletas
      }
    } else if (req.url.includes("getAllBoletas")) {
      // Obtener todas las boletas
      const resultados = await boletaModel.getAllBoletas();
      if (resultados.length > 0) {
        return res.status(200).json(boletaDto.templateSuccess(resultados)); // Retorna todas las boletas si existen
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound()); // Retorna error si no se encuentran boletas
      }
    } else if (req.url.includes("agregarBoleta") && req.method === "POST") {
      // Agregar una nueva boleta
      if (!boletaData) {
        return res.status(400).json(boletaDto.templateInvalidData()); // Retorna error si no hay datos de boleta
      }

      // Convertir fecha en objeto Date
      boletaData.fecha_adquisicion = new Date(boletaData.fecha_adquisicion);

      // Convertir id_lugar en ObjectId
      if (boletaData.id_lugar) {
        boletaData.id_lugar = new ObjectId(boletaData.id_lugar);
      }

      // Convertir id_asiento en array de ObjectId
      if (boletaData.id_asiento && boletaData.id_asiento.length > 0) {
        boletaData.id_asiento = boletaData.id_asiento.map((id) => new ObjectId(id));
      } else {
        boletaData.id_asiento = []; // Asegúrate de que sea un array vacío si no hay asientos
      }

      const result = await boletaModel.addBoleta(boletaData);
      return res.status(201).json(boletaDto.templateSuccess(result)); // Retorna éxito en la adición de la boleta
    } else if (req.url.includes("actualizarBoleta") && req.method === "PUT") {
      // Obtener boletaId de req.params
      const boletaId = req.params.idBoleta;

      // Verificar si el boletaData existe
      if (!boletaId || !boletaData) {
        return res.status(400).json(boletaDto.templateInvalidData()); // Retorna error si faltan datos o id de boleta
      }

      // Verificar si boletaData tiene una fecha de adquisición y convertirla en un objeto Date
      if (boletaData.fecha_adquisicion) {
        boletaData.fecha_adquisicion = new Date(boletaData.fecha_adquisicion);
      }

      // Convertir id_asiento en array de ObjectId
      if (boletaData.id_asiento && boletaData.id_asiento.length > 0) {
        boletaData.id_asiento = boletaData.id_asiento.map((id) => new ObjectId(id));
      } else {
        boletaData.id_asiento = []; // Asegúrate de que sea un array vacío si no hay asientos
      }

      const result = await boletaModel.updateBoleta(boletaId, boletaData);
      if (result.modifiedCount > 0) {
        return res.status(200).json(boletaDto.templateSuccess(result)); // Retorna éxito en la actualización de la boleta
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound()); // Retorna error si no se encuentra la boleta para actualizar
      }
    } else if (req.url.includes("eliminarBoleta") && req.method === "DELETE") {
      // Eliminar una boleta
      if (!idBoleta) {
        return res.status(400).json(boletaDto.templateInvalidId()); // Retorna error si no se proporciona id de boleta
      }

      const result = await boletaModel.deleteBoleta(idBoleta);
      if (result.deletedCount > 0) {
        return res.status(200).json(boletaDto.templateSuccess(result)); // Retorna éxito en la eliminación de la boleta
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound()); // Retorna error si no se encuentra la boleta para eliminar
      }
    } else {
      return res.status(400).json(boletaDto.templateInvalidAction()); // Retorna error si la acción no es válida
    }
  } catch (error) {
    console.error("Error en el controlador de boletas:", error);
    return res
      .status(500)
      .json(boletaDto.templateError("Error interno del servidor")); // Manejo de errores
  }
};

/**
 * Función para renderizar la vista HTML de boletas.
 * Obtiene las boletas por cliente e intenta renderizar el archivo HTML correspondiente.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const renderBoleta = async (req, res) => {
  const boletaModel = new BoletaModel();
  try {
    const { identificacionCliente,idLugar } = req.query;

    await boletaModel.init(); // Inicializa el modelo de boleta
    
    const boleta = await boletaModel.getBoletasByClienteAndLugar(identificacionCliente,idLugar);

    if (boleta.length === 0) {
      return res.status(404).send("Boleta no encontrada"); // Retorna error si no se encuentra la boleta
    }

    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/boleta.html")); // Envia el archivo HTML
  } catch (error) {
    console.error("Error al renderizar la boleta:", error);
    res.status(500).send("Error interno del servidor"); // Manejo de errores
  }
};

module.exports = {
  BoletaAPIController,
  renderBoleta,
};
