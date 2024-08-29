class PeliculaDTO {
    templateSuccess(peliculas) {
        return { success: true, data: peliculas };
    }

    templateNoPeliculasFound() {
        return { success: false, message: 'No se encontraron películas' };
    }

    templateInvalidAction(message) {
        return { success: false, message: message || 'Acción no válida' };
    }

    templateError(message) {
        return { success: false, message: message };
    }
}

module.exports = PeliculaDTO;
