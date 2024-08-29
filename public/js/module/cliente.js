document.addEventListener('DOMContentLoaded', async () => {
    // Obtener el ID de la película de la URI
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('peliculaId');

    // URL para obtener los datos de la película
    const url = `http://localhost:3000/pelicula/getPeliculaById?idPelicula=${peliculaId}`;

    try {
        // Hacer la petición para obtener los datos de la película
        const response = await fetch(url);
        const peliculas = await response.json();
        const pelicula= peliculas.data[0]
        // Verificar que la petición fue exitosa
        if (response.ok) {
            // Construir la sección movie_image
            const movieImageElement = document.querySelector('.movie_image img');
            movieImageElement.src = pelicula.img;
            movieImageElement.alt = pelicula.titulo;

            // Construir la sección movie_data
            const movieTitleElement = document.querySelector('.movie_title_genre h3');
            const movieGenreElement = document.querySelector('.movie_title_genre p');
            const movieSinopsisElement = document.querySelector('.movie_sinopsis p');

            movieTitleElement.textContent = pelicula.titulo;
            movieGenreElement.textContent = pelicula.genero.join(', ');
            movieSinopsisElement.textContent = pelicula.sinopsis;

            // Construir la sección movie_casting
            const carouselCast = document.querySelector('.carousel_cast');
            carouselCast.innerHTML = ''; // Limpiar contenido previo

            pelicula.casting.forEach(actor => {
                const castMember = document.createElement('div');
                castMember.classList.add('cast_member');

                castMember.innerHTML = `
                    <div class="caster_image">
                        <img src="${actor.img}" alt="${actor.nombre}">
                    </div>
                    <div class="caster_details">
                        <h4>${actor.nombre}</h4>
                        <p>${actor.personaje}</p>
                    </div>
                `;

                carouselCast.appendChild(castMember);
            });
            // Agregar funcionalidad al botón book-button
            const bookButtons = document.querySelectorAll('.book-button');

            bookButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const now = new Date();

                    const today = now.toISOString().split('.')[0] + 'Z'; 


                    // Construir la URL de redirección
                    const redirectUrl = `http://localhost:3000/asiento/verAsiento?idPelicula=${peliculaId}&fechaInicioFiltro=${today}`;

                    // Redirigir a la nueva URL
                    window.location.href = redirectUrl;
                });
            });
            
            
        } else {
            console.error('Error al obtener los datos de la película:', pelicula);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'back-button'
    const backButton = document.querySelector('.back-button');
    // Agregar un evento de clic al botón
    backButton.addEventListener('click', function() {
        // Redirigir a la URI deseada
        window.location.href = `http://localhost:3000/lugar`;
    });
});
