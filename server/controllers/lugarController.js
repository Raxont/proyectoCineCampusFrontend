const { validationResult } = require("express-validator");
const LugarModel = require("../models/lugarModel");
const LugarDTO = require("../dto/lugarDto");
const { ObjectId } = require("mongodb");

const LugarRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fechaInicioFiltro, idPelicula } = req.query;
  const lugarModel = new LugarModel();
  const lugarDto = new LugarDTO();
  try {
    
    // Validar existencia del idPelicula
    if (idPelicula) {
      if (!ObjectId.isValid(idPelicula)) {
        return res
          .status(400)
          .json(lugarDto.templateInvalidId());
      }

      const peliculaExiste = await lugarModel.getLugaresByPelicula(idPelicula);
      if (peliculaExiste.length === 0) {
        return res
          .status(404)
          .json(lugarDto.templatePeliculaNotFound());
      }
    }

    // Validar formato ISODate si se proporciona una fecha
    if (fechaInicioFiltro && isNaN(Date.parse(fechaInicioFiltro))) {
      return res
        .status(400)
        .json(lugarDto.templateInvalidDate());
    }

    if (req.url.includes("lugaresPorFecha")) {
      // Obtener todos los lugares por una fecha específica
      const resultados = await lugarModel.getAllLugarWithPeliculaByDay(fechaInicioFiltro);

      if (resultados.length > 0) {
        return res.status(200).json(lugarDto.templateSuccess(resultados));
      } else {
        return res
          .status(404)
          .json(lugarDto.templateNoFunctionsForDate());
      }
    } else if (req.url.includes("lugaresPorPelicula")) {
      // Obtener todos los lugares por una película específica
      const resultados = await lugarModel.getLugaresByPelicula(idPelicula);

      if (resultados.length > 0) {
        return res.status(200).json(lugarDto.templateSuccess(resultados));
      } else {
        return res
          .status(404)
          .json(lugarDto.templatePeliculaNotFound());
      }
    } else {
      return res.status(400).json(lugarDto.templateInvalidAction());
    }
  } catch (error) {
    console.error("Error en el controlador de lugares:", error);
    return res
      .status(500)
      .json(lugarDto.templateError("Error interno del servidor"));
  }
}

module.exports = LugarRequest;
