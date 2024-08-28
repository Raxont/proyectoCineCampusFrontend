const { validationResult } = require("express-validator");
const LugarModel = require("../models/lugarModel");
const LugarDTO = require("../dto/lugarDto");
const { ObjectId } = require("mongodb");

const LugarRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fechaInicioFiltro, fechaFinFiltro, idPelicula, idLugar } = req.query;
  const lugarModel = new LugarModel();
  const lugarDto = new LugarDTO();
  
  try {
    await lugarModel.init();
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

    // Validar formato ISODate si se proporciona fechaInicioFiltro o fechaFinFiltro
    if ((fechaInicioFiltro && isNaN(Date.parse(fechaInicioFiltro))) ||
        (fechaFinFiltro && isNaN(Date.parse(fechaFinFiltro)))) {
      return res
        .status(400)
        .json(lugarDto.templateInvalidDate());
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
        return res.status(200).json(lugarDto.templateSuccess(resultados));
      } else {
        return res
          .status(404)
          .json(lugarDto.templateNoFunctionsForDate());
      }
    } else if (req.url.includes("lugaresPorPelicula")) {
      // Obtener todos los lugares por una película específica y fechas
      const resultados = await lugarModel.getLugaresByPelicula(idPelicula,fechaInicioFiltro);

      if (resultados.length > 0) {
        return res.status(200).json(lugarDto.templateSuccess(resultados));
      } else {
        return res
          .status(404)
          .json(lugarDto.templatePeliculaNotFound());
      }
    }else if (req.url.includes("getInfoLugar")) {
      // Obtener todos los lugares por una película específica y fechas
      const resultados = await lugarModel.getLugar(idLugar);

      if (resultados.length > 0) {
        return res.status(200).json(lugarDto.templateSuccess(resultados));
      } else {
        return res
          .status(404)
          .json(lugarDto.templateLugarNotFound());
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
