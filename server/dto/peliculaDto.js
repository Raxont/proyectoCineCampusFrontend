class PeliculaDTO {
    templateSuccess(peliculas) {
        return { success: true, data: peliculas };
    }

    templateNoPeliculasFound() {
        return { success: false, message: 'No se encontraron películas' };
    }

    templateError(message) {
        return { success: false, message: message };
    }
}

module.exports = PeliculaDTO;
