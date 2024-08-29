// Espera a que el contenido del documento se haya cargado completamente
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener el ID del cliente desde los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionCliente = urlParams.get('identificacionCliente');
    
    // Verificar si se proporcionó la identificación del cliente
    if (!identificacionCliente) {
        console.error('Identificación del cliente no proporcionada.');
        return; // Detener la ejecución si no hay ID de cliente
    }

    try {
        // Hacer una solicitud para obtener los datos de la boleta del cliente
        const response = await fetch(`/boleta/boletasPorCliente?identificacionCliente=${identificacionCliente}`);
        const result = await response.json();
        
        // Verificar que la solicitud fue exitosa y que se encontraron boletas
        if (!result.success || result.data.length === 0) {
            console.error('Boleta no encontrada');
            return; // Detener la ejecución si no se encuentran boletas
        }

        const boleta = result.data[0]; // Obtener el primer elemento del array de boletas
        
        // Convertir la fecha ISO a un objeto Date
        let fechaISO = (boleta.lugar.fecha_inicio);
        let fecha = new Date(fechaISO);
        
        // Extraer la hora en formato UTC
        let horas = fecha.getUTCHours().toString().padStart(2, '0');
        let minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
        let hora = `${horas}:${minutos}`;
        
        // Formatear la fecha en formato 'Thu Sep 05 2024'
        let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
        let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha);

        // Obtener el contenedor para mostrar la boleta
        const ticketDiv = document.getElementById('ticket');

        // Crear una lista de códigos de asientos
        const asientosTexto = boleta.asientos.map(asiento => asiento.codigo || 'N/A').join(', ');

        // Insertar el contenido HTML en el contenedor de la boleta
        ticketDiv.innerHTML = `
            <div class="movie-poster">
                <img src="${boleta.pelicula.img}" alt="Poster">
            </div>
            
            <div class="movie-title">${boleta.pelicula.titulo}</div>
            <div class="sub-text">Show this ticket at the entrance</div>

            <hr class="linea-media">
            
            <div class="row">
                <div class="info">
                    <div class="info-title">Cinema</div>
                    <div class="info-detail-name">Cine Campus</div>
                </div>
                <div class="img">
                    <img src="${boleta.lugar.logoUrl || '../storage/Rectangle 376.png'}" alt="Cine">
                </div>
            </div>

            <div class="row1">
                <div class="info">
                    <div class="info-title">Date</div>
                    <div class="info-detail">${fechaFormateada || 'N/A'}</div>
                </div>
                <div class="info">
                    <div class="info-title">Time</div>
                    <div class="info-detail">${hora || 'N/A'}</div>
                </div>
            </div>

            <div class="row2">
                <div class="info">
                    <div class="info-title">Cinema Hall #</div>
                    <div class="info-detail">${boleta.lugar.nombre || 'N/A'}</div>
                </div>
                <div class="info2">
                    <div class="info-title">Seat</div>
                    <div class="info-detail">${asientosTexto || 'N/A'}</div>
                </div>
            </div>

            <div class="row3">
                <div class="info">
                    <div class="info-title">Cost</div>
                    <div class="info-detail">$${boleta.precio}</div>
                </div>
                <div class="info2">
                    <div class="info-title">Order ID</div>
                    <div class="info-detail">${boleta._id}</div>
                </div>
            </div>
            <div class="lineas">----------------</div>
            <div class="barcode">
                <img src="${boleta.barcodeUrl || '../storage/Barcode.svg'}" alt="Codigo de barras">
            </div>
        `;
    } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error al hacer la solicitud:', error);
    }
});

// Espera a que el contenido del documento se haya cargado completamente
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'back-button'
    const backButton = document.querySelector('.back-button');
    
    // Agregar un evento de clic al botón de retroceso
    backButton.addEventListener('click', function() {
        // Redirigir a la URI deseada
        window.location.href = `http://localhost:3000/lugar`;
    });
});
