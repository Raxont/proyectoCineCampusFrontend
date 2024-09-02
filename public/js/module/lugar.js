// Espera a que el contenido del documento se haya cargado completamente
document.addEventListener('DOMContentLoaded', function () {

    // Función para obtener la identificación desde el servidor
    async function obtenerIdentificacion() {
        try {
            // Obtiene la identificación del cliente desde la API
            const response = await fetch('/api/config');
            const data = await response.json();
    
            // Asegúrate de que la identificación se obtenga correctamente y sea un número
            const cliente = Number(data.identificacion);
    
            return cliente;
        } catch (error) {
            console.error('Error al obtener la identificación:', error);
            return null;  // Devuelve null en caso de error para manejarlo adecuadamente
        }
    }

    // Función para obtener la información del cliente usando la identificación
    function obtenerInfoCliente(identificacion) {
        return fetch(`http://localhost:3000/cliente/info/${identificacion}`)
            .then(response => response.json())
            .then(data => {return data.resultado})
            .catch(error => console.error('Error al obtener la información del cliente:', error));
    }

    // Función para actualizar el título principal con el nombre del cliente
    function actualizarTituloPrincipal(cliente) {
        const mainTitleElement = document.querySelector('.main-title small');
        if (mainTitleElement) {
            mainTitleElement.textContent = `Hi, ${cliente.nombre}!`;
        }
    }

    // Función principal para inicializar la página
    async function inicializarPagina() {
        const gente=await obtenerIdentificacion()
        const respuesta = await obtenerInfoCliente(gente);
        actualizarTituloPrincipal(respuesta);
    }
        

    // Llama a la función para inicializar la página
    inicializarPagina();

    // Función para inicializar y configurar Flickity
    function initializeFlickity() {
        var flickityElement = document.querySelector('.gallery');

        if (!flickityElement) {
            console.log('No se encontró el elemento de Flickity');
            return;
        }

        if (flickityElement.flickityInstance) {
            flickityElement.flickityInstance.destroy();
            console.log('Flickity destruido para re-inicializar');
        }

        flickityElement.classList.add('js-flickity');

        var flickityInstance = new Flickity(flickityElement, {
            wrapAround: true,
            friction: 0.2,
            cellAlign: 'center',
            autoPlay: 4000,
            pauseAutoPlayOnHover: true,
            prevNextButtons: false
        });

        flickityElement.flickityInstance = flickityInstance;

        var viewport = flickityInstance.viewport;
        if (viewport) {
            viewport.style.height = '100%';
        }

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
        const fechaInicio = today.toISOString().split('T')[0];

        const fechaFinal = new Date(today);
        fechaFinal.setDate(today.getDate() + 14);
        const fechaFin = fechaFinal.toISOString().split('T')[0];

        fetch(`/lugar/lugaresPorFecha?fechaInicioFiltro=${encodeURIComponent(fechaInicio)}&fechaFinFiltro=${encodeURIComponent(fechaFin)}`)
            .then(response => response.json())
            .then(data => {
                const galeriaContainer = document.getElementById('galeria');
                galeriaContainer.innerHTML = data.data.map(pelicula => `
                    <div class="gallery-cell" data-id="${pelicula._id}">
                        <img src="${pelicula.img}" alt="${pelicula.titulo}">
                        <div class="title">${pelicula.titulo}</div>
                        <div class="genre">${pelicula.genero.join(', ')}</div>
                    </div>
                `).join('');

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

    // Función para cargar y mostrar películas que se estrenarán pronto
    function loadMovies2() {
        const today = new Date();
        const fechaInicial = new Date(today);
        fechaInicial.setDate(today.getDate() + 14);
        const fechaInicio = fechaInicial.toISOString().split('T')[0];

        const fechaFinal = new Date(today);
        fechaFinal.setDate(today.getDate() + 100);
        const fechaFin = fechaFinal.toISOString().split('T')[0];

        fetch(`/lugar/lugaresPorFecha?fechaInicioFiltro=${encodeURIComponent(fechaInicio)}&fechaFinFiltro=${encodeURIComponent(fechaFin)}`)
            .then(response => response.json())
            .then(data => {
                const galeriaContainer = document.getElementById('movie-soon');
                galeriaContainer.innerHTML = data.data.map(pelicula => `
                    <div class="movie-comming" data-id="${pelicula._id}">
                        <img src="${pelicula.img}" alt="${pelicula.titulo}">
                        <div class="movie-comming-content">
                            <div class="title-soon">${pelicula.titulo}</div>
                            <div class="genre-soon">${pelicula.genero.join(', ')}</div>
                        </div>
                    </div>
                `).join('');

                galeriaContainer.querySelectorAll('.movie-comming').forEach(element => {
                    element.addEventListener('click', function () {
                        const peliculaId = this.getAttribute('data-id');
                        window.location.href = `http://localhost:3000/cliente/sin?peliculaId=${peliculaId}`;
                    });
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Llama a las funciones para cargar las películas
    loadMovies();
    loadMovies2();
});
