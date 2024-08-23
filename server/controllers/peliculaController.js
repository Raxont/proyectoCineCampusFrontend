const PeliculaModel = require('../models/peliculaModel');
const PeliculaDTO = require('../dto/peliculaDto');

const PeliculaRequest = async (req, res) => {
    const peliculaModel = new PeliculaModel();
    const peliculaDto = new PeliculaDTO();

    try {
        const peliculas = await peliculaModel.getAllPeliculas();

        if (peliculas.length > 0) {
            return res.status(200).json(peliculaDto.templateSuccess(peliculas));
        } else {
            return res.status(404).json(peliculaDto.templateNoPeliculasFound());
        }
    } catch (error) {
        console.error("Error en el controlador de películas:", error);
        return res.status(500).json(peliculaDto.templateError("Error interno del servidor"));
    }
}

module.exports = { PeliculaRequest };
