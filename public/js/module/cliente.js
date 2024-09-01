// Espera a que el contenido del documento se haya cargado completamente
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener el ID de la película desde los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('peliculaId');

    // Construir la URL para obtener los datos de la película
    const url = `http://localhost:3000/pelicula/getPeliculaById?idPelicula=${peliculaId}`;

    try {
        // Hacer la petición para obtener los datos de la película
        const response = await fetch(url);
        const peliculas = await response.json();
        const pelicula = peliculas.data[0]; // Obtener el primer elemento de la respuesta

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

            // Añadir cada miembro del reparto a la sección carousel_cast
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

            // Agregar funcionalidad al botón de trailer
            const trailerButton = document.querySelector('.movie_trailer');
            let trailerVisible = false;

            trailerButton.addEventListener('click', () => {
                const movieImageContainer = document.querySelector('.movie_image');
                
                if (!trailerVisible) {
                    // Cambiar la imagen por el video
                    movieImageContainer.innerHTML = `
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${pelicula.trailerId}" 
                        title="YouTube video player" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
                    `;
                    trailerButton.textContent = "Quitar Tráiler";
                } else {
                    // Volver a mostrar la imagen
                    movieImageContainer.innerHTML = `<img src="${pelicula.img}" alt="${pelicula.titulo}">`;
                    trailerButton.textContent = "▶ Watch Trailer";
                }

                trailerVisible = !trailerVisible;
            });

            // Agregar funcionalidad al botón de reserva
            const bookButtons = document.querySelectorAll('.book-button');

            bookButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const now = new Date();

                    // Obtener la fecha y hora actual en formato ISO
                    const today = now.toISOString().split('.')[0] + 'Z'; 

                    // Construir la URL de redirección para la selección de asientos
                    const redirectUrl = `http://localhost:3000/asiento/verAsiento?idPelicula=${peliculaId}&fechaInicioFiltro=${today}`;

                    // Redirigir a la nueva URL
                    window.location.href = redirectUrl;
                });
            });
            
        } else {
            // Manejar el error si la petición no fue exitosa
            console.error('Error al obtener los datos de la película:', pelicula);
        }
    } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error al hacer la solicitud:', error);
    }
});


// Espera a que el contenido del documento se haya cargado completamente
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'back-button'
    const backButton = document.querySelector('.back-button');
    
    // Agregar un evento de clic al botón para redirigir a la URI deseada
    backButton.addEventListener('click', function() {
        window.location.href = `http://localhost:3000/lugar`;
    });
});
