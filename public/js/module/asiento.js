
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idPelicula = urlParams.get('idPelicula');
    const fechaInicioFiltro = urlParams.get('fechaInicioFiltro');

    if (!idPelicula || !fechaInicioFiltro) {
        console.error('Parámetros no proporcionados.');
        return;
    }
    
    let selectedDay = null;
    let selectedTime = null;

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

        console.log("base de datos:", result.data);

        result.data.forEach(lugar => {
            let fechaISO = lugar.fecha_inicio;
            let fecha = new Date(fechaISO);

            let horas = fecha.getUTCHours().toString().padStart(2, '0');
            let minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
            let hora = `${horas}:${minutos}`;

            let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit' };
            let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha).replace(',', '');

            if (!daysData[fechaFormateada]) {
                daysData[fechaFormateada] = [];
            }

            daysData[fechaFormateada].push({
                hora,
                precio: lugar.precio,
                fechaISO,
                idLugar: lugar._id // Almacenar la ID del lugar
            });
        });

        // Crear HTML para los días sin duplicados
        const daysHTML = Object.keys(daysData).map(fechaFormateada => {
            const [diaSemana, diaMes] = fechaFormateada.split(' ');
            return `
                <div class="container-day" data-fecha="${fechaFormateada}">
                    <small class="tittle">${diaSemana}</small>
                    <div class="sub">${diaMes}</div>
                </div>
            `;
        }).join('');

        // Añadir el HTML de los días al contenedor
        dayContainer.innerHTML = daysHTML;

        // Añadir event listeners para los días
        dayContainer.querySelectorAll('.container-day').forEach(day => {
            day.addEventListener('click', function() {
                const fechaSeleccionada = day.getAttribute('data-fecha');

                if (selectedDay === day) {
                    selectedDay.classList.remove('selected');
                    selectedDay = null;
                    timeContainer.innerHTML = ''; // Limpiar horas si se deselecciona el día
                } else {
                    if (selectedDay) {
                        selectedDay.classList.remove('selected');
                    }
                    day.classList.add('selected');
                    selectedDay = day;

                    // Mostrar las horas correspondientes al día seleccionado
                    const timesHTML = daysData[fechaSeleccionada].map(({ hora, precio, idLugar }) => `
                        <div class="container-time" data-id="${idLugar}">
                            <div class="tittle">${hora}</div>
                            <small class="sub">$${precio} -3D</small>
                        </div>
                    `).join('');

                    timeContainer.innerHTML = timesHTML;

                    // Re-agregar event listeners para las horas después de actualizar el HTML
                    addTimeEventListeners();
                }

                updateButton();
            });
        });

        // Añadir event listeners para los tiempos
        function addTimeEventListeners() {
            const times = timeContainer.querySelectorAll('.container-time');
            times.forEach(time => {
                time.addEventListener('click', async function() {
                    idLugar = time.getAttribute('data-id');
                    
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
                    if (selectedDay && selectedTime) {
                        console.log('ID del lugar seleccionado:', idLugar);
                        
                        // Realizar la petición a la URI para obtener los asientos disponibles
                        try {
                            const response = await fetch(`http://localhost:3000/boleta/asientosDisponibles?idLugar=${idLugar}`);
                            if (!response.ok) {
                                throw new Error('Error al obtener los asientos disponibles');
                            }
        
                            const asientosDisponibles = await response.json();
        
                            // Generar el DOM con los asientos disponibles
                            const asientosContainer = document.querySelector('.asientos__container'); // Asumiendo que existe este contenedor
        
                            // Limpiar el contenido previo
                            asientosContainer.innerHTML = '';
        
                            // Crear los artículos de asientos basados en la información recibida
                            asientosDisponibles.forEach(asiento => {
                                const article = document.createElement('article');
                                article.className = asiento.tipo === 'preferencial' ? 'asientos__preferenciales' : 'asientos__normal';
        
                                const divFila = document.createElement('div');
                                divFila.setAttribute('fila', asiento.fila);
                                
                                const small = document.createElement('small');
                                small.textContent = asiento.fila;
                                divFila.appendChild(small);
        
                                const divAsientosLista = document.createElement('div');
                                divAsientosLista.className = 'asientos__lista';
        
                                asiento.asientos.forEach(asiento => {
                                    let contador=1;
                                    const input = document.createElement('input');
                                    input.type = 'checkbox';
                                    input.name = 'seat';
                                    input.value = asiento.codigo;
                                    input.id = asiento.codigo;
        
                                    if (asiento.reservado) {
                                        input.disabled = true;
                                        input.classList.add('reserved');
                                    }
        
                                    const label = document.createElement('label');
                                    label.setAttribute('for', asiento.codigo);
                                    label.setAttribute('data-place', contador);
                                    contador+=1;
                                    divAsientosLista.appendChild(input);
                                    divAsientosLista.appendChild(label);
                                });
        
                                divFila.appendChild(divAsientosLista);
                                article.appendChild(divFila);
        
                                // Añadir el artículo al contenedor principal
                                asientosContainer.appendChild(article);
                            });
        
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }
                    updateButton();
                });
            });
        }

        function updateButton() {
            const buyButton = document.querySelector('.buy');
            if (buyButton) {
                buyButton.disabled = !(selectedDay && selectedTime);
            }
        }

        addEventListeners(); // Asegúrate de que esta función esté definida
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }

    // Lógica para el formulario
    function addEventListeners() {
        const myform = document.querySelector('#myform');
        const buyButton = document.querySelector('.buy');

        // Verificar si el botón existe
        if (!buyButton) {
            console.error('Elemento con clase .buy no encontrado');
            return;
        }

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
});



document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'back-button'
    const backButton = document.querySelector('.back-button');

    // Agregar un evento de clic al botón
    backButton.addEventListener('click', function() {
        // Redirigir a la URI deseada
        window.location.href = 'http://localhost:3000/cliente';
    });
});
