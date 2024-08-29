const { validationResult } = require("express-validator");
const LugarModel = require("../models/lugarModel");
const LugarDTO = require("../dto/lugarDto");
const { ObjectId } = require("mongodb");

/**
 * Controlador para manejar solicitudes relacionadas con lugares.
 * Valida los datos de la solicitud, realiza consultas sobre lugares
 * basadas en filtros proporcionados, y maneja respuestas y errores.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const LugarRequest = async (req, res) => {
  const errors = validationResult(req); // Valida los datos del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
  }

  const { fechaInicioFiltro, fechaFinFiltro, idPelicula, idLugar } = req.query;
  const lugarModel = new LugarModel();
  const lugarDto = new LugarDTO();

  try {
    await lugarModel.init(); // Inicializa el modelo de lugar

    // Validar existencia del idPelicula
    if (idPelicula) {
      if (!ObjectId.isValid(idPelicula)) {
        return res.status(400).json(lugarDto.templateInvalidId()); // Retorna error si el ID no es válido
      }

      const peliculaExiste = await lugarModel.getLugaresByPelicula(idPelicula); // Verifica si hay lugares asociados a la película
      if (peliculaExiste.length === 0) {
        return res.status(404).json(lugarDto.templatePeliculaNotFound()); // Retorna error si la película no tiene lugares
      }
    }

    // Validar formato ISODate si se proporciona fechaInicioFiltro o fechaFinFiltro
    if ((fechaInicioFiltro && isNaN(Date.parse(fechaInicioFiltro))) ||
        (fechaFinFiltro && isNaN(Date.parse(fechaFinFiltro)))) {
      return res.status(400).json(lugarDto.templateInvalidDate()); // Retorna error si las fechas no son válidas
    }

    if (req.url.includes("lugaresPorFecha")) {
      // Obtener todos los lugares por un rango de fechas
      let resultados = await lugarModel.getAllLugarWithPeliculaByDay(fechaInicioFiltro, fechaFinFiltro);

      // Eliminar datos duplicados utilizando un Set
      resultados = resultados.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t._id.toString() === value._id.toString() && t.name === value.name
        ))
      );

      if (resultados.length > 0) {
        return res.status(200).json(lugarDto.templateSuccess(resultados)); // Retorna lugares encontrados
      } else {
        return res.status(404).json(lugarDto.templateNoFunctionsForDate()); // Retorna error si no se encuentran lugares para las fechas dadas
      }
    } else if (req.url.includes("lugaresPorPelicula")) {
      // Obtener todos los lugares por una película específica y fechas
      const resultados = await lugarModel.getLugaresByPelicula(idPelicula, fechaInicioFiltro);

      if (resultados.length > 0) {
        return res.status(200).json(lugarDto.templateSuccess(resultados)); // Retorna lugares encontrados para la película
      } else {
        return res.status(404).json(lugarDto.templatePeliculaNotFound()); // Retorna error si no se encuentran lugares para la película
      }
    } else if (req.url.includes("getInfoLugar")) {
      // Obtener información de un lugar específico
      const resultados = await lugarModel.getLugar(idLugar);

      if (resultados.length > 0) {
        return res.status(200).json(lugarDto.templateSuccess(resultados)); // Retorna información del lugar encontrado
      } else {
        return res.status(404).json(lugarDto.templateLugarNotFound()); // Retorna error si el lugar no se encuentra
      }
    } else {
      return res.status(400).json(lugarDto.templateInvalidAction()); // Retorna error si la acción no es válida
    }
  } catch (error) {
    console.error("Error en el controlador de lugares:", error);
    return res.status(500).json(lugarDto.templateError("Error interno del servidor")); // Manejo de errores
  }
}

module.exports = LugarRequest;
