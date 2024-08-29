// Espera a que el contenido del documento se haya cargado completamente
document.addEventListener('DOMContentLoaded', function () {
    
    // Función para inicializar y configurar Flickity
    function initializeFlickity() {
        var flickityElement = document.querySelector('.gallery');

        // Verifica si el elemento de Flickity existe
        if (!flickityElement) {
            console.log('No se encontró el elemento de Flickity');
            return;
        }

        // Si ya existe una instancia de Flickity, la destruye para reinicializar
        if (flickityElement.flickityInstance) {
            flickityElement.flickityInstance.destroy();
            console.log('Flickity destruido para re-inicializar');
        }

        // Añade una clase para aplicar estilos específicos
        flickityElement.classList.add('js-flickity');

        // Inicializa Flickity con opciones de configuración
        var flickityInstance = new Flickity(flickityElement, {
            wrapAround: true,              // Permite el desplazamiento circular
            friction: 0.2,                 // Configura la fricción del desplazamiento
            cellAlign: 'center',           // Alinea las celdas al centro
            autoPlay: 4000,                // Configura la reproducción automática cada 4 segundos
            pauseAutoPlayOnHover: true,    // Pausa la reproducción automática al pasar el ratón por encima
            prevNextButtons: false         // Desactiva los botones de navegación
        });

        // Asigna la instancia de Flickity al elemento para referencia futura
        flickityElement.flickityInstance = flickityInstance;

        // Ajusta la altura del viewport de Flickity
        var viewport = flickityInstance.viewport;

        if (viewport) {
            viewport.style.height = '100%';
        }

        // Forza un redibujo de la página con un evento de resize
        window.dispatchEvent(new Event('resize'));

        return flickityInstance;
    }

    // Función para actualizar la visibilidad del texto basado en la celda seleccionada
    function updateTextVisibility(flickityInstance) {
        var cells = document.querySelectorAll('.gallery-cell');
        cells.forEach(function (cell, index) {
            var title = cell.querySelector('.title');
            var genre = cell.querySelector('.genre');
            if (index === flickityInstance.selectedIndex) {
                title.style.opacity = 1;
                genre.style.opacity = 1;
            } else {
                title.style.opacity = 0;
                genre.style.opacity = 0;
            }
        });
    }

    // Función para cargar y mostrar películas en la galería
    function loadMovies() {
        const today = new Date();
        const fechaInicio = today.toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD

        // Calcula la fecha final que es 14 días después de hoy
        const fechaFinal = new Date(today);
        fechaFinal.setDate(today.getDate() + 14);
        const fechaFin = fechaFinal.toISOString().split('T')[0];
        
        // Realiza una solicitud para obtener las películas entre las fechas especificadas
        fetch(`/lugar/lugaresPorFecha?fechaInicioFiltro=${encodeURIComponent(fechaInicio)}&fechaFinFiltro=${encodeURIComponent(fechaFin)}`)
        .then(response => response.json())
            .then(data => {
                const galeriaContainer = document.getElementById('galeria');
                // Muestra las películas en la galería
                galeriaContainer.innerHTML = data.data.map(pelicula => `
                    <div class="gallery-cell" data-id="${pelicula._id}">
                        <img src="${pelicula.img}" alt="${pelicula.titulo}">
                        <div class="title">${pelicula.titulo}</div>
                        <div class="genre">${pelicula.genero.join(', ')}</div>
                    </div>
                `).join('');

                // Añadir redirección al hacer clic en una película
                galeriaContainer.querySelectorAll('.gallery-cell').forEach(element => {
                    element.addEventListener('click', function () {
                        const peliculaId = this.getAttribute('data-id');
                        window.location.href = `http://localhost:3000/cliente?peliculaId=${peliculaId}`;
                    });
                });

                var flickityInstance = initializeFlickity();

                if (flickityInstance) {
                    updateTextVisibility(flickityInstance);
                    flickityInstance.on('select', () => updateTextVisibility(flickityInstance));
                } else {
                    console.log('Flickity no se inicializó correctamente');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Llama a la función para cargar las películas
    loadMovies();
});

// Espera a que el contenido del documento se haya cargado completamente
document.addEventListener('DOMContentLoaded', function () {
    // Función para cargar y mostrar películas que se estrenarán pronto
    function loadMovies2() {
        const today = new Date();
        const fechaInicial = new Date(today);
        fechaInicial.setDate(today.getDate() + 14);
        const fechaInicio = fechaInicial.toISOString().split('T')[0]; // Fecha de 14 días a partir de hoy en formato YYYY-MM-DD

        // Calcula la fecha final que es 100 días después de hoy
        const fechaFinal = new Date(today);
        fechaFinal.setDate(today.getDate() + 100);
        const fechaFin = fechaFinal.toISOString().split('T')[0];
        
        // Realiza una solicitud para obtener las películas entre las fechas especificadas
        fetch(`/lugar/lugaresPorFecha?fechaInicioFiltro=${encodeURIComponent(fechaInicio)}&fechaFinFiltro=${encodeURIComponent(fechaFin)}`)
        .then(response => response.json())
            .then(data => {
                const galeriaContainer = document.getElementById('movie-soon');
                // Muestra las películas que se estrenarán pronto
                galeriaContainer.innerHTML = data.data.map(pelicula => `
                    <div class="movie-comming" data-id="${pelicula._id}">
                        <img src="${pelicula.img}" alt="${pelicula.titulo}">
                        <div class="movie-comming-content">
                            <div class="title-soon">${pelicula.titulo}</div>
                            <div class="genre-soon">${pelicula.genero.join(', ')}</div>
                        </div>
                    </div>
                `).join('');

                // Añadir redirección al hacer clic en una película
                galeriaContainer.querySelectorAll('.movie-comming').forEach(element => {
                    element.addEventListener('click', function () {
                        const peliculaId = this.getAttribute('data-id');
                        window.location.href = `http://localhost:3000/cliente/sin?peliculaId=${peliculaId}`;
                    });
                });
            })
            .catch(error => console.error('Error:', error));
    }
    
    // Llama a la función para cargar las películas que se estrenarán pronto
    loadMovies2();
});
