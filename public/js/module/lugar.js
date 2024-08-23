document.addEventListener('DOMContentLoaded', function () {
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

        // Añadir la clase 'js-flickity' antes de inicializar
        flickityElement.classList.add('js-flickity');

        var flickityInstance = new Flickity(flickityElement, {
            wrapAround: true,
            friction: 0.2,
            cellAlign: 'center',
            autoPlay: 5000,
            pauseAutoPlayOnHover: true,
            prevNextButtons: false
        });

        flickityElement.flickityInstance = flickityInstance;

        var viewport = flickityInstance.viewport;

        if (viewport) {
            viewport.style.height = '100%';
        }

        // Forzar un redibujo con un evento de resize
        window.dispatchEvent(new Event('resize'));

        return flickityInstance;
    }

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

    function loadMovies() {
        const today = new Date();
        const fechaInicio = today.toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD

        // Calcula la fecha final que es 14 días después de hoy
        const fechaFinal = new Date(today);
        fechaFinal.setDate(today.getDate() + 14);
        const fechaFin = fechaFinal.toISOString().split('T')[0];
        console.log('Fecha inicial',fechaInicio);
        console.log('Fecha final',fechaFin);
        
        fetch(`/lugar/lugaresPorFecha?fechaInicioFiltro=${encodeURIComponent(fechaInicio)}&fechaFinFiltro=${encodeURIComponent(fechaFin)}`)
        .then(response => response.json())
            .then(data => {
                const galeriaContainer = document.getElementById('galeria');
                galeriaContainer.innerHTML = data.data.map(pelicula => `
                    <div class="gallery-cell">
                        <img src="${pelicula.img}" alt="${pelicula.titulo}">
                        <div class="title">${pelicula.titulo}</div>
                        <div class="genre">${pelicula.genero.join(', ')}</div>
                    </div>
                `).join('');
                console.log('Contenido cartelera insertado:', galeriaContainer.innerHTML);
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

    loadMovies();
});

document.addEventListener('DOMContentLoaded', function () {
    function loadMovies2() {
        const today = new Date();
        const fechaInicial = new Date(today);
        fechaInicial.setDate(today.getDate() + 14);
        const fechaInicio = fechaInicial.toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD

        // Calcula la fecha final que es 14 días después de hoy
        const fechaFinal = new Date(today);
        fechaFinal.setDate(today.getDate() + 100);
        const fechaFin = fechaFinal.toISOString().split('T')[0];
        console.log('Fecha inicial',fechaInicio);
        console.log('Fecha final',fechaFin);
        
        fetch(`/lugar/lugaresPorFecha?fechaInicioFiltro=${encodeURIComponent(fechaInicio)}&fechaFinFiltro=${encodeURIComponent(fechaFin)}`)
        .then(response => response.json())
            .then(data => {
                const galeriaContainer = document.getElementById('movie-soon');
                galeriaContainer.innerHTML = data.data.map(pelicula => `
                    <div class="movie-comming">
                        <img src="${pelicula.img}" alt="${pelicula.titulo}">
                        <div class="movie-comming-content">
                            <div class="title-soon">${pelicula.titulo}</div>
                            <div class="genre-soon">${pelicula.genero.join(', ')}</div>
                        </div>
                    </div>
                `).join('');
                console.log('Contenido soon insertado:', galeriaContainer.innerHTML);
            })
            .catch(error => console.error('Error:', error));
    }
    loadMovies2();
});