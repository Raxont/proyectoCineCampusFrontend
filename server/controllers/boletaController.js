const { validationResult } = require("express-validator");
const BoletaModel = require("../models/boletaModel");
const BoletaDTO = require("../dto/boletaDto");
const { ObjectId } = require("mongodb");
const path = require("path");

const BoletaAPIController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { identificacionCliente, idLugar, idBoleta } = req.query;
  const boletaData = req.body;
  const boletaDto = new BoletaDTO();
  const boletaModel = new BoletaModel();

  try {
    // Inicializar la conexión
    await boletaModel.init();

    // Validar existencia del identificacionCliente
    if (identificacionCliente && !/^\d+$/.test(identificacionCliente)) {
      return res.status(400).json(boletaDto.templateInvalidId());
    }

    // Convertir idLugar e idBoleta en ObjectId si están presentes
    let lugarId = null;
    let boletaId = null;

    if (idLugar && !ObjectId.isValid(idLugar)) {
      return res.status(400).json(boletaDto.templateInvalidId());
    } else if (idLugar) {
      lugarId = new ObjectId(idLugar);
    }

    if (idBoleta && !ObjectId.isValid(idBoleta)) {
      return res.status(400).json(boletaDto.templateInvalidId());
    } else if (idBoleta) {
      boletaId = new ObjectId(idBoleta);
    }

    if (req.url.includes("boletasPorCliente")) {
      // Obtener boletas por cliente
      const resultados = await boletaModel.getBoletasByCliente(identificacionCliente);
      if (resultados.length > 0) {
        return res.status(200).json(boletaDto.templateSuccess(resultados));
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound());
      }

    } else if (req.url.includes("getBoletasByClienteAndLugar")) {
      // Obtener boleta por cliente y id lugar
      const resultados = await boletaModel.getBoletasByClienteAndLugar(identificacionCliente,idLugar);
      if (resultados.length > 0) {
        return res.status(200).json(boletaDto.templateSuccess(resultados));
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound());
      }
    }else if (req.url.includes("getAllBoletas")) {
      // Obtener todas las boletas
      const resultados = await boletaModel.getAllBoletas();
      if (resultados.length > 0) {
        return res.status(200).json(boletaDto.templateSuccess(resultados));
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound());
      }
    } else if (req.url.includes("agregarBoleta") && req.method === "POST") {
      // Agregar una nueva boleta
      if (!boletaData) {
        return res.status(400).json(boletaDto.templateInvalidData());
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
      return res.status(201).json(boletaDto.templateSuccess(result));
    } else if (req.url.includes("actualizarBoleta") && req.method === "PUT") {
      // Obtener boletaId de req.params
      const boletaId = req.params.idBoleta;

      // Verificar si el boletaData existe
      if (!boletaId || !boletaData) {
        return res.status(400).json(boletaDto.templateInvalidData());
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
        return res.status(200).json(boletaDto.templateSuccess(result));
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound());
      }
    } else if (req.url.includes("eliminarBoleta") && req.method === "DELETE") {
      // Eliminar una boleta
      if (!idBoleta) {
        return res.status(400).json(boletaDto.templateInvalidId());
      }

      const result = await boletaModel.deleteBoleta(idBoleta);
      if (result.deletedCount > 0) {
        return res.status(200).json(boletaDto.templateSuccess(result));
      } else {
        return res.status(404).json(boletaDto.templateBoletaNotFound());
      }
    } else {
      return res.status(400).json(boletaDto.templateInvalidAction());
    }
  } catch (error) {
    console.error("Error en el controlador de boletas:", error);
    return res
      .status(500)
      .json(boletaDto.templateError("Error interno del servidor"));
  }
};

// Nueva función para manejar la vista HTML
const renderBoleta = async (req, res) => {
  const boletaModel = new BoletaModel();
  try {
    const { identificacionCliente } = req.query;

    // Inicializar la conexión
    await boletaModel.init();
    
    const boleta = await boletaModel.getBoletasByCliente(identificacionCliente);

    if (boleta.length === 0) {
      return res.status(404).send("Boleta no encontrada");
    }

    res.sendFile(path.join(__dirname, "../../", process.env.STATIC, "views/boleta.html"));
  } catch (error) {
    console.error("Error al renderizar la boleta:", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = {
  BoletaAPIController,
  renderBoleta,
};
