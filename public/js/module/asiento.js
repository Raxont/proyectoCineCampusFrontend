document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idPelicula = urlParams.get('idPelicula');
    const fechaInicioFiltro = urlParams.get('fechaInicioFiltro');

    if (!idPelicula || !fechaInicioFiltro) {
        console.error('Parámetros no proporcionados.');
        return;
    }

    try {
        const response = await fetch(`/lugar/lugaresPorPelicula?idPelicula=${idPelicula}&fechaInicioFiltro=${fechaInicioFiltro}`);
        const result = await response.json();

        if (response.status !== 200 || !result.data || result.data.length === 0) {
            console.error('Funciones no encontradas para la película dada.');
            return;
        }

        const asientoDiv = document.getElementById('selectDates');
        if (!asientoDiv) {
            console.error('No se encontró el contenedor selectDates en el DOM.');
            return;
        }

        const dayContainer = asientoDiv.querySelector('.day');
        const timeContainer = asientoDiv.querySelector('.time');

        if (!dayContainer || !timeContainer) {
            console.error('No se encontraron los contenedores .day o .time en el DOM.');
            return;
        }

        dayContainer.innerHTML = '';  // Limpiar contenido previo
        timeContainer.innerHTML = ''; // Limpiar contenido previo

        const daysData = {}; // Para almacenar horarios por fecha
        let daysHTML = '';

        console.log("base de datos:", result.data);

        result.data.forEach(lugar => {
            let fechaISO = lugar.fecha_inicio;
            let fecha = new Date(fechaISO);

            let horas = fecha.getUTCHours().toString().padStart(2, '0');
            let minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
            let hora = `${horas}:${minutos}`;

            let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit' };
            let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha).replace(',', '');

            let diaSemana = fechaFormateada.split(' ')[0];
            let diaMes = fechaFormateada.split(' ')[1];

            const timeHTML = `
                <div class="container-time" data-fecha="${fechaISO}">
                    <div class="tittle">${hora}</div>
                    <small class="sub">$${lugar.precio} -3D</small>
                </div>
            `;

            // Agregar al objeto daysData
            if (!daysData[fechaISO]) {
                daysData[fechaISO] = [];
            }
            daysData[fechaISO].push(timeHTML);
        });

        // Crear HTML para los días sin duplicados
        Object.keys(daysData).forEach(fechaISO => {
            let fecha = new Date(fechaISO);
            let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit' };
            let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha).replace(',', '');
            
            let diaSemana = fechaFormateada.split(' ')[0];
            let diaMes = fechaFormateada.split(' ')[1];

            daysHTML += `
                <div class="container-day" data-fecha="${fechaISO}">
                    <small class="tittle">${diaSemana}</small>
                    <div class="sub">${diaMes}</div>
                </div>
            `;
        });

        // Añadir el HTML de los días al contenedor
        dayContainer.innerHTML = daysHTML;

        // Añadir event listeners para los días
        dayContainer.querySelectorAll('.container-day').forEach(day => {
            day.addEventListener('click', function() {
                const fechaSeleccionada = day.getAttribute('data-fecha');
                if (fechaSeleccionada && daysData[fechaSeleccionada]) {
                    // Ordenar horarios por hora para mostrar en orden
                    const sortedTimes = daysData[fechaSeleccionada].sort((a, b) => {
                        const horaA = a.match(/(\d{2}:\d{2})/)[0];
                        const horaB = b.match(/(\d{2}:\d{2})/)[0];
                        return horaA.localeCompare(horaB);
                    });
                    
                    timeContainer.innerHTML = sortedTimes.join('');
                    
                    // Re-agregar event listeners para las horas después de actualizar el HTML
                    addTimeEventListeners();
                } else {
                    timeContainer.innerHTML = '';
                }
            });
        });

        // Actualizar el precio total en el footer
        const totalPrice = result.data.reduce((acc, funcion) => acc + parseFloat(funcion.precio), 0);
        const priceElement = document.querySelector('.price p');
        if (priceElement) {
            priceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }

        addEventListeners(); // Asegúrate de que esta función esté definida
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
});


let selectedDay = null;
let selectedTime = null;

function addEventListeners() {
    const myform = document.querySelector('#myform');
    const days = document.querySelectorAll('.container-day');
    const buyButton = document.querySelector('.buy');

    // Verificar si el botón existe
    if (!buyButton) {
        console.error('Elemento con clase .buy no encontrado');
        return;
    }

    function updateButton() {
        if (selectedDay && selectedTime) {
            buyButton.disabled = false;
        } else {
            buyButton.disabled = true;
        }
    }

    days.forEach(day => {
        day.addEventListener('click', function() {
            if (selectedDay === day) {
                selectedDay.classList.remove('selected');
                selectedDay = null;
            } else {
                if (selectedDay) {
                    selectedDay.classList.remove('selected');
                }
                day.classList.add('selected');
                selectedDay = day;
            }
            updateButton();
        });
    });

    if (myform) {
        myform.addEventListener('submit', (e) => {
            e.preventDefault();
            if (selectedDay && selectedTime) {
                const input = new FormData(e.target);
                const seat = [];
                for (let [name, value] of input) seat.unshift(value);
                
                const dayTitle = selectedDay.querySelector('.tittle').textContent;
                const daySub = selectedDay.querySelector('.sub').textContent;
                const timeTitle = selectedTime.querySelector('.tittle').textContent;
                const timeSub = selectedTime.querySelector('.sub').textContent;

                console.log("Asiento enviado:", seat);
                console.log('Selected Day enviado:', dayTitle);
                console.log('Day Sub enviado:', daySub);
                console.log('Selected Time enviado:', timeTitle);
                console.log('Time Sub enviado:', timeSub);

                // Aquí puedes enviar estos datos al servidor o manejarlos como quieras
            } else {
                console.log('Form submission failed: day or time not selected.');
            }
        });
    } else {
        console.error('Elemento con ID myform no encontrado');
    }
}

function addTimeEventListeners() {
    const times = document.querySelectorAll('.container-time');
    const buyButton = document.querySelector('.buy');

    // Verificar si el botón existe
    if (!buyButton) {
        console.error('Elemento con clase .buy no encontrado');
        return;
    }

    function updateButton() {
        if (selectedDay && selectedTime) {
            buyButton.disabled = false;
        } else {
            buyButton.disabled = true;
        }
    }

    times.forEach(time => {
        time.addEventListener('click', function() {
            if (selectedTime === time) {
                selectedTime.classList.remove('selected');
                selectedTime = null;
            } else {
                if (selectedTime) {
                    selectedTime.classList.remove('selected');
                }
                time.classList.add('selected');
                selectedTime = time;
            }
            updateButton();
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'back-button'
    const backButton = document.querySelector('.back-button');

    // Agregar un evento de clic al botón
    backButton.addEventListener('click', function() {
        // Redirigir a la URI deseada
        window.location.href = 'http://localhost:3000/cliente';
    });
});
