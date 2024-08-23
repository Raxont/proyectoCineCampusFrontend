document.addEventListener('DOMContentLoaded', function () {
    var flickityElement = document.querySelector('.js-flickity');

    // Inicializa Flickity y almacena la instancia
    var flickityInstance = new Flickity(flickityElement, {
        wrapAround: true,
        friction: 0.2,
        cellAlign: "center",
        autoPlay: 5000,
        pauseAutoPlayOnHover: true,
        prevNextButtons: false
    });

    // Accede al viewport de Flickity
    var viewport = flickityInstance.viewport;

    // Modifica el estilo en línea del viewport
    viewport.style.height = '100%';
    
});

document.addEventListener('DOMContentLoaded', function() {
    var flkty = new Flickity('.js-flickity', {
        wrapAround: true,
        friction: 0.2,
        cellAlign: "center",
        autoPlay: 5000,
        pauseAutoPlayOnHover: true,
        prevNextButtons: false
    });

    function updateTextVisibility() {
        var cells = document.querySelectorAll('.gallery-cell');
        cells.forEach(function(cell, index) {
            var title = cell.querySelector('.title');
            var genre = cell.querySelector('.genre');
            if (index === flkty.selectedIndex) {
                title.style.opacity = 1; // Muestra el texto en la celda seleccionada
                genre.style.opacity = 1;
            } else {
                title.style.opacity = 0; // Oculta el texto en las celdas no seleccionadas
                genre.style.opacity = 0;
            }
        });
    }

    // Llama a la función al cargar la página para la celda seleccionada inicialmente
    updateTextVisibility();

    // También la llama cada vez que se selecciona una nueva celda
    flkty.on('select', updateTextVisibility);
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/peliculas')
        .then(response => response.json())
        .then(data => {
            const galeriaContainer = document.getElementById('galeria');
            galeriaContainer.innerHTML = data.map(pelicula => `
                <div class="pelicula">
                    <h2>${pelicula.titulo}</h2>
                    <img src="${pelicula.img}" alt="${pelicula.titulo}" />
                    <p>${pelicula.sinopsis}</p>
                    <h3>Géneros:</h3>
                    <ul>${pelicula.genero.map(g => `<li>${g}</li>`).join('')}</ul>
                    <h3>Duración: ${pelicula.duracion} minutos</h3>
                    <h3>Elenco:</h3>
                    <ul class="casting">
                        ${pelicula.casting.map(actor => `
                            <li>
                                <img src="${actor.img}" alt="${actor.nombre}" />
                                <p><strong>${actor.nombre}</strong> como ${actor.personaje}</p>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error:', error));
});
