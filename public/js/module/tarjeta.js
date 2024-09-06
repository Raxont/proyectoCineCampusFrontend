document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionCliente = urlParams.get('identificacionCliente');
    const idLugar = urlParams.get('idLugar');

    const apiUrl = "https://proyectocinecampusfrontend.onrender.com";
    // const apiUrl = 'http://localhost:3000';  // Para desarrollo local

    if (!identificacionCliente) {
        console.error('Identificación del cliente no proporcionada.');
        return;
    }

    let boleta = null;
    try {
        const response = await fetch(`${apiUrl}/boleta/getBoletasByClienteAndLugar?identificacionCliente=${identificacionCliente}&idLugar=${idLugar}`);
        const result = await response.json();

        if (!result.success || result.data.length === 0) {
            console.error('Boleta no encontrada');
            return;
        }

        boleta = result.data[0];
        const cantidad=Array.isArray(boleta.asientos) ? boleta.asientos.length : 0
        const tasa_servicio=1.99*cantidad
        let precioOriginal = boleta.precio;
        
        let fechaISO = boleta.lugar.fecha_inicio;
        let fecha = new Date(fechaISO);
        let horas = fecha.getUTCHours().toString().padStart(2, '0');
        let minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
        let hora = `${horas}:${minutos}`;

        let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
        let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha);
        
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
                <h4>${Array.isArray(boleta.asientos) ? boleta.asientos.length : 0} Ticket(s)</h4>
                <p>${asientosCodes}</p>
            </article>
            <article class="order_typeSeat_price">
                <h4>Regular Seat</h4>
                <p id="precioBoleta">$${precioOriginal}</p>
            </article>
            <article class="order_service_price">
                <h4>Service Fee</h4>
                <p>$1.99 x${Array.isArray(boleta.asientos) ? boleta.asientos.length : 0}</p>
            </article>
        `;

        document.getElementById('custom-radio').addEventListener('change', async (event) => {
            const checkBox = event.target;
            const urlDescuento = `${apiUrl}/tarjeta/getDescuento`;
            const urlActualizarBoleta = `${apiUrl}/boleta/actualizarBoleta/${boleta._id}`;
            
            const data = {
                idboleta: boleta._id,
                identificacionCliente: identificacionCliente
            };

            if (checkBox.checked) {
                try {
                    const response = await fetch(urlDescuento, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        const descuento = await response.json();
                        const descuentoData = descuento.detalles.precioOriginal.precioConDescuento;

                        // Actualiza el precio en la boleta y la base de datos
                        boleta.precio = descuentoData;
                        document.getElementById('precioBoleta').textContent = `$${boleta.precio}`;
                        
                        await fetch(urlActualizarBoleta, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ precio: boleta.precio })
                        });
                    } else {
                        console.error('Error:', response.statusText);
                        alert("El cliente no tiene una tarjeta activa");
                        checkBox.checked = false;
                    }
                } catch (error) {
                    console.error('Error al hacer la solicitud:', error);
                    checkBox.checked = false;
                }
            } else {
                // Restablece el precio original en la boleta y la base de datos
                document.getElementById('precioBoleta').textContent = `$${precioOriginal}`;
                
                await fetch(urlActualizarBoleta, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ precio: precioOriginal })
                });
            }
        });

        document.getElementById('buy').addEventListener('click', async() => {     
            const urlActualizarBoleta = `${apiUrl}/boleta/actualizarBoleta/${boleta._id}`;
            let precioOriginal = boleta.precio;
            await fetch(urlActualizarBoleta, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ precio: boleta.precio+tasa_servicio })
            });
            
            const userConfirmed = confirm(`El precio total con la tarifa de servicios es $${boleta.precio+tasa_servicio} ¿Desea continuar con la reserva del asiento?`);
            if (userConfirmed) {
                // Redirige a la página de boleta si el usuario confirma
                window.location.href = `${apiUrl}/boleta/verBoleta?identificacionCliente=${identificacionCliente}&idLugar=${idLugar}`;
            } else {
                // Redirige a la página de la boleta si el descuento no es aplicado
                await fetch(urlActualizarBoleta, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ precio: precioOriginal })
                });
                return;
            }
            
        });

    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }
});

// Maneja el evento de clic en el botón de retroceso
document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = "https://proyectocinecampusfrontend.onrender.com";
    // const apiUrl = 'http://localhost:3000';  // Para desarrollo local
    // Obtiene el elemento con la clase 'back-button'
    const backButton = document.querySelector('.back-button');
    // Agrega un evento de clic al botón
    backButton.addEventListener('click', function() {
        // Redirige a la URI deseada
        window.location.href = `${apiUrl}/lugar`;
    });
});