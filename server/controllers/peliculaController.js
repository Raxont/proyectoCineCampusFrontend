const { validationResult } = require("express-validator");
const PeliculaModel = require('../models/peliculaModel');
const PeliculaDTO = require('../dto/peliculaDto');
const { ObjectId } = require('mongodb');

const PeliculaController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { idPelicula } = req.query;  // Asumiendo que se pasa el ID de la película como query param
    const peliculaModel = new PeliculaModel();
    const peliculaDto = new PeliculaDTO();

    try {
        await peliculaModel.init();

        if (req.url.includes("getPeliculaById")) {
            // Obtener película por ID
            const pelicula = await peliculaModel.findPeliculaById(idPelicula);
            if (pelicula) {
                return res.status(200).json(peliculaDto.templateSuccess([pelicula]));
            } else {
                return res.status(404).json(peliculaDto.templateNoPeliculasFound());
            }
        } else {
            return res.status(400).json(peliculaDto.templateInvalidAction("Acción no válida"));
        }
    } catch (error) {
        console.error("Error en el controlador de películas:", error);
        return res.status(500).json(peliculaDto.templateError("Error interno del servidor"));
    }
}

module.exports = { PeliculaController };
