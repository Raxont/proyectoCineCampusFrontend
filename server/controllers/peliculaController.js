const { validationResult } = require("express-validator");
const PeliculaModel = require('../models/peliculaModel');
const PeliculaDTO = require('../dto/peliculaDto');
const { ObjectId } = require('mongodb');

/**
 * Controlador para manejar solicitudes relacionadas con películas.
 * Valida los datos de la solicitud, obtiene una película por su ID,
 * y maneja respuestas y errores según corresponda.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
const PeliculaController = async (req, res) => {
    const errors = validationResult(req); // Valida los datos del request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Retorna errores de validación
    }

    const { idPelicula } = req.query;  // Asumiendo que se pasa el ID de la película como query param
    const peliculaModel = new PeliculaModel();
    const peliculaDto = new PeliculaDTO();

    try {
        await peliculaModel.init(); // Inicializa el modelo de película

        if (req.url.includes("getPeliculaById")) {
            // Obtener película por ID
            const pelicula = await peliculaModel.findPeliculaById(idPelicula);
            if (pelicula) {
                return res.status(200).json(peliculaDto.templateSuccess([pelicula])); // Retorna la película encontrada
            } else {
                return res.status(404).json(peliculaDto.templateNoPeliculasFound()); // Retorna error si la película no se encuentra
            }
        } else {
            return res.status(400).json(peliculaDto.templateInvalidAction("Acción no válida")); // Retorna error si la acción no es válida
        }
    } catch (error) {
        console.error("Error en el controlador de películas:", error);
        return res.status(500).json(peliculaDto.templateError("Error interno del servidor")); // Manejo de errores
    }
}

module.exports = { PeliculaController };
