// Espera a que el contenido del documento se haya cargado completamente
document.addEventListener('DOMContentLoaded', async () => {
    // Obtiene los parámetros de la URL de la página actual
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionCliente = urlParams.get('identificacionCliente');
    const idLugar = urlParams.get('idLugar');
    // Verifica si se ha proporcionado la identificación del cliente
    if (!identificacionCliente) {
        console.error('Identificación del cliente no proporcionada.');
        return;
    }

    let boleta = null; // Variable para almacenar la boleta

    try {
        // Realiza una solicitud a la API para obtener la boleta del cliente
        const response = await fetch(`/boleta/getBoletasByClienteAndLugar?identificacionCliente=${identificacionCliente}&idLugar=${idLugar}`);
        const result = await response.json();

        // Verifica si la solicitud fue exitosa y si se encontró una boleta
        if (!result.success || result.data.length === 0) {
            console.error('Boleta no encontrada');
            return;
        }

        boleta = result.data[0]; // Asigna la boleta encontrada a la variable
        
        // Convierte la fecha de inicio del lugar a un objeto Date y formatea la hora
        let fechaISO = boleta.lugar.fecha_inicio;
        let fecha = new Date(fechaISO);
        let horas = fecha.getUTCHours().toString().padStart(2, '0');
        let minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
        let hora = `${horas}:${minutos}`;

        // Configura las opciones para formatear la fecha
        let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
        let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha);
        
        // Pobla la sección con la información de la película
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

        // Pobla la sección con los detalles del pedido
        const orderDetailsSection = document.querySelector('.order_details');
        const asientosCodes = Array.isArray(boleta.asientos) 
            ? boleta.asientos.map(asiento => asiento.codigo).join(', ') 
            : boleta.asientos.codigo; 
        
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
                <p>$${boleta.precio}</p>
            </article>
            <article class="order_service_price">
                <h4>Service Fee</h4>
                <p>$1.99 x${Array.isArray(boleta.asientos) ? boleta.asientos.length : 0}</p>
            </article>
        `;
        
        // Maneja el clic en el botón "buy" para aplicar descuento
        document.getElementById('buy').addEventListener('click', async () => {
            const checkBox  = document.getElementById('custom-radio'); // Obtiene el checkbox para aplicar descuento
            const url = 'http://localhost:3000/tarjeta/getDescuento';
            const data = {
                idboleta: boleta._id, 
                identificacionCliente: identificacionCliente
            };

            if (checkBox.checked) {
                try {
                    // Realiza una solicitud para obtener descuento si el checkbox está marcado
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        // Redirige a la página de la boleta si el descuento es exitoso
                        window.location.href = `http://localhost:3000/boleta/verBoleta?identificacionCliente=${identificacionCliente}&idLugar=${idLugar}`;
                    } else {
                        console.error('Error:', response.statusText);
                        alert("El cliente no tiene una tarjeta activa");
                    }
                } catch (error) {
                    console.error('Error al hacer la solicitud:', error);
                }
            } else {
                // Redirige a la página de la boleta si el descuento no es aplicado
                window.location.href = `http://localhost:3000/boleta/verBoleta?identificacionCliente=${identificacionCliente}&idLugar=${idLugar}`;
            }
        });

    } catch (error) {
        console.error('Error al hacer la solicitud:', error); // Maneja errores de la solicitud
    }
});

// Maneja el evento de clic en el botón de retroceso
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el elemento con la clase 'back-button'
    const backButton = document.querySelector('.back-button');
    // Agrega un evento de clic al botón
    backButton.addEventListener('click', function() {
        // Redirige a la URI deseada
        window.location.href = `http://localhost:3000/lugar`;
    });
});
