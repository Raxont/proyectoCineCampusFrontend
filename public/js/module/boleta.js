document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const identificacionCliente = urlParams.get('identificacionCliente');
    if (!identificacionCliente) {
        console.error('Identificación del cliente no proporcionada.');
        return;
    }

    try {
        const response = await fetch(`/boleta/boletasPorCliente?identificacionCliente=${identificacionCliente}`);
        const result = await response.json();

        if (!result.success || result.data.length === 0) {
            console.error('Boleta no encontrada');
            return;
        }

        const boleta = result.data[0]; // Accede al primer elemento del array
        
        let fechaISO = (boleta.lugar.fecha_inicio); // Ejemplo de fecha en formato ISO
        let fecha = new Date(fechaISO); // Convertir la fecha ISO a un objeto Date
        
        // Extraer la hora en formato UTC
        let horas = fecha.getUTCHours().toString().padStart(2, '0'); // Obtiene las horas en formato UTC
        let minutos = fecha.getUTCMinutes().toString().padStart(2, '0'); // Obtiene los minutos en formato UTC
        let hora = `${horas}:${minutos}`;
        
        // Extraer la fecha en formato "Thu Sep 05 2024"
        let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
        let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha); // Cambia 'en-US' si prefieres otro formato local

        const ticketDiv = document.getElementById('ticket');

        // Crear la lista de códigos de asientos
        const asientosTexto = boleta.asientos.map(asiento => asiento.codigo || 'N/A').join(', ');


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
                    <div class="info-detail-name">${boleta.lugar.nombre}</div>
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
                <div class="info">
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
        console.error('Error al hacer la solicitud:', error);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'back-button'
    const urlParams = new URLSearchParams(window.location.search);
    const backButton = document.querySelector('.back-button');
    const identificacionCliente = urlParams.get('identificacionCliente');
    if (!identificacionCliente) {
        console.error('Identificación del cliente no proporcionada.');
        return;
    }
    // Agregar un evento de clic al botón
    backButton.addEventListener('click', function() {
        // Redirigir a la URI deseada
        window.location.href = `http://localhost:3000/tarjeta/verBoleta?identificacionCliente=${identificacionCliente}`;
    });
});