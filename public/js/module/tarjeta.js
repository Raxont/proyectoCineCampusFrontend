document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionCliente = urlParams.get('identificacionCliente');
    if (!identificacionCliente) {
        console.error('Identificación del cliente no proporcionada.');
        return;
    }

    let boleta = null;
    try {
        const response = await fetch(`/boleta/boletasPorCliente?identificacionCliente=${identificacionCliente}`);
        const result = await response.json();

        if (!result.success || result.data.length === 0) {
            console.error('Boleta no encontrada');
            return;
        }

        boleta = result.data[0]; // Accede al primer elemento del array

        let fechaISO = boleta.lugar.fecha_inicio;
        let fecha = new Date(fechaISO);
        let horas = fecha.getUTCHours().toString().padStart(2, '0');
        let minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
        let hora = `${horas}:${minutos}`;

        let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
        let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha);
        
        // Poblar sección movie_data
        const movieDataSection = document.querySelector('.movie_data');
        movieDataSection.innerHTML = `
            <article class="movie_image">
                <img src="${boleta.pelicula.img}" alt="${boleta.pelicula.titulo}">
            </article>
            <article class="movie_details">
                <div class="movie_title_genre">
                    <h4>${boleta.pelicula.titulo}</h4>
                    <p>${boleta.pelicula.genero}</p>
                </div>
                <div class="movie_cine_date">
                    <h4>CineCampus</h4>
                    <p>${fechaFormateada}. ${hora}</p>
                </div>
            </article>
        `;

        // Poblar sección order_details
        const orderDetailsSection = document.querySelector('.order_details');
        const asientosCodes = Array.isArray(boleta.asientos) 
            ? boleta.asientos.map(asiento => asiento.codigo).join(', ') 
            : boleta.asientos.codigo; // Adaptado si asientos no es un array
        
        orderDetailsSection.innerHTML = `
            <article class="order_number">
                <h4>Order Number :</h4>
                <p>${boleta._id}</p>
            </article>
            <article class="order_tickets_seat">
                <h4>${Array.isArray(boleta.asientos) ? boleta.asientos.length : 1} Ticket(s)</h4>
                <p>${asientosCodes}</p>
            </article>
            <article class="order_typeSeat_price">
                <h4>Regular Seat</h4>
                <p>$${boleta.precio+=boleta.precio}</p>
            </article>
            <article class="order_service_price">
                <h4>Service Fee</h4>
                <p>$1.99 x${Array.isArray(boleta.asientos) ? boleta.asientos.length : 0}</p>
            </article>
        `;

        // Manejar el clic en el botón
        document.getElementById('buy').addEventListener('click', async () => {
            const url = 'http://localhost:3000/tarjeta/getDescuento';
            const data = {
                idLugar: boleta.lugar.idLugar, // Asegúrate de que `idLugar` esté correctamente obtenido del objeto `boleta`
                identificacionCliente: identificacionCliente
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    // Maneja la respuesta aquí
                    console.log('Descuento recibido:', responseData);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            }
        });

    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }

});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'back-button'
    const urlParams = new URLSearchParams(window.location.search);
    const backButton = document.querySelector('.buy-ticket');
    const identificacionCliente = urlParams.get('identificacionCliente');

    // Agregar un evento de clic al botón
    backButton.addEventListener('click', function() {
        // Redirigir a la URI deseada
        window.location.href = `http://localhost:3000/boleta/verBoleta?identificacionCliente=${identificacionCliente}`;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'back-button'
    const backButton = document.querySelector('.back-button');

    // Agregar un evento de clic al botón
    backButton.addEventListener('click', function() {
        // Redirigir a la URI deseada
        window.location.href = 'http://localhost:3000/asiento/verAsiento?idPelicula=66c8f6913b9fd081fe7cc8f5&fechaInicioFiltro=2024-10-01T10:00:00.000Z';
    });
});

