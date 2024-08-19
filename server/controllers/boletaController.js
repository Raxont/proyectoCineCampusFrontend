const { validationResult } = require("express-validator");
const BoletaModel = require("../models/boletaModel");
const BoletaDTO = require("../dto/boletaDto");
const { ObjectId } = require("mongodb");

class BoletaController {
  constructor() {
    this.boletaModel = new BoletaModel();
    this.boletaDto = new BoletaDTO();
    console.log("Instancia del Boleta", this.boletaModel.constructor.name);
  }

  async BoletaRequest(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identificacionCliente, idLugar, idBoleta } = req.query;
    const boletaData = req.body;

    try {

      // Validar existencia del identificacionCliente
      if (identificacionCliente) {
        if (!/^\d+$/.test(identificacionCliente)) {
          return res.status(400).json(this.boletaDto.templateInvalidId());
        }
      }

       // Convertir idLugar e idBoleta en ObjectId si están presentes
       let lugarId = null;
       let boletaId = null;
 
       if (idLugar) {
         if (!ObjectId.isValid(idLugar)) {
           return res.status(400).json(this.boletaDto.templateInvalidId());
         }
         lugarId = new ObjectId(idLugar);
       }
 
       if (idBoleta) {
         if (!ObjectId.isValid(idBoleta)) {
           return res.status(400).json(this.boletaDto.templateInvalidId());
         }
         boletaId = new ObjectId(idBoleta);
       }

      if (req.url.includes("boletasPorCliente")) {
        // Obtener boletas por cliente
        const resultados = await this.boletaModel.getBoletasByCliente(
          identificacionCliente
        );

        if (resultados.length > 0) {
          return res
            .status(200)
            .json(this.boletaDto.templateSuccess(resultados));
        } else {
          return res.status(404).json(this.boletaDto.templateBoletaNotFound());
        }
      } 
      else if (req.url.includes("asientosDisponibles")) {
        // Obtener asientos disponibles en un lugar específico
        const resultados = await this.boletaModel.getAsientosAvailable(idLugar);

        if (resultados.length > 0) {
          return res
            .status(200)
            .json(this.boletaDto.templateSuccess(resultados));
        } else {
          return res
            .status(404)
            .json(this.boletaDto.templateNoSeatsAvailable());
        }
      } 
      else if (req.url.includes("getAllBoletas")) {
        // Obtener todas las boletas
        const resultados = await this.boletaModel.getAllBoletas();

        if (resultados.length > 0) {
          return res
            .status(200)
            .json(this.boletaDto.templateSuccess(resultados));
        } else {
          return res.status(404).json(this.boletaDto.templateBoletaNotFound());
        }
      } 
      else if (req.url.includes("agregarBoleta") && req.method === "POST") {
        // Agregar una nueva boleta
        if (!boletaData) {
          return res.status(400).json(this.boletaDto.templateInvalidData());
        }

        // Convertir fecha en objeto Date
        boletaData.fecha_adquisicion = new Date(boletaData.fecha_adquisicion);

        // Convertir id_lugar en ObjectId
        if (boletaData.id_lugar) {
          boletaData.id_lugar = new ObjectId(boletaData.id_lugar);
        }

        // Convertir id_asiento en array de ObjectId
        if (boletaData.id_asiento && boletaData.id_asiento.length > 0) {
          boletaData.id_asiento = boletaData.id_asiento.map(id => new ObjectId(id));
        } else {
          boletaData.id_asiento = []; // Asegúrate de que sea un array vacío si no hay asientos
        }

        const result = await this.boletaModel.addBoleta(boletaData);
        return res.status(201).json(this.boletaDto.templateSuccess(result));
      } 
      else if (req.url.includes("actualizarBoleta") && req.method === "PUT") {
        // Obtener boletaId de req.params
        const boletaId = req.params.idBoleta;
    
        // Verificar si el boletaData existe
        if (!boletaId || !boletaData) {
            return res.status(400).json(this.boletaDto.templateInvalidData());
        }
    
        // Verificar si boletaData tiene una fecha de adquisición y convertirla en un objeto Date
        if (boletaData.fecha_adquisicion) {
            boletaData.fecha_adquisicion = new Date(boletaData.fecha_adquisicion);
        }
    
        // Convertir id_asiento en array de ObjectId
        if (boletaData.id_asiento && boletaData.id_asiento.length > 0) {
            boletaData.id_asiento = boletaData.id_asiento.map(id => new ObjectId(id));
        } else {
            boletaData.id_asiento = []; // Asegúrate de que sea un array vacío si no hay asientos
        }
    
        const result = await this.boletaModel.updateBoleta(boletaId, boletaData);
        if (result.modifiedCount > 0) {
            return res.status(200).json(this.boletaDto.templateSuccess(result));
        } else {
            return res.status(404).json(this.boletaDto.templateBoletaNotFound());
        }
    }
      else if (req.url.includes("eliminarBoleta") && req.method === "DELETE") {
        // Eliminar una boleta
        if (!idBoleta) {
          return res.status(400).json(this.boletaDto.templateInvalidId());
        }

        const result = await this.boletaModel.deleteBoleta(idBoleta);
        if (result.deletedCount > 0) {
          return res.status(200).json(this.boletaDto.templateSuccess(result));
        } else {
          return res.status(404).json(this.boletaDto.templateBoletaNotFound());
        }
      } 
      else {
        return res.status(400).json(this.boletaDto.templateInvalidAction());
      }
    } catch (error) {
      console.error("Error en el controlador de boletas:", error);
      return res
        .status(500)
        .json(this.boletaDto.templateError("Error interno del servidor"));
    }
  }
}

module.exports = BoletaController;
