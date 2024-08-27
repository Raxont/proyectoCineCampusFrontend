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
        // Fetch para obtener lugares por película
        const lugaresResponse = await fetch(`/lugar/lugaresPorPelicula?idPelicula=${idPelicula}&fechaInicioFiltro=${fechaInicioFiltro}`);
        const lugaresResult = await lugaresResponse.json();

        if (lugaresResponse.status !== 200 || !lugaresResult.data || lugaresResult.data.length === 0) {
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

        console.log("base de datos:", lugaresResult.data);

        // Procesar los datos recibidos para los lugares
        lugaresResult.data.forEach(lugar => {
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
                    const idLugar = time.getAttribute('data-id');
                    
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

                        // Realizar la petición para obtener los asientos disponibles
                        try {
                            const asientosResponse = await fetch(`/asiento/asientosDisponibles?idLugar=${idLugar}`);
                            const asientosResult = await asientosResponse.json();

                            console.log("asientosDisponibles", asientosResult);

                            // Procesar la información recibida de los asientos
                            const asientosContainer = document.querySelector('.asientos__container');
                            asientosContainer.innerHTML = '';  // Limpiar contenido previo

                            // Crear elementos para los asientos
                            asientosResult.forEach(asiento => {
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
                                    let contador = 1;
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
                                    contador += 1;
                                    divAsientosLista.appendChild(input);
                                    divAsientosLista.appendChild(label);
                                });

                                divFila.appendChild(divAsientosLista);
                                article.appendChild(divFila);

                                // Añadir el artículo al contenedor principal
                                asientosContainer.appendChild(article);
                            });

                        } catch (error) {
                            console.error('Error al obtener los asientos disponibles:', error);
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

        // Inicializar los listeners
        addEventListeners();

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }

    // Lógica para el formulario
    function addEventListeners() {
        const myform = document.querySelector('#myform');
        const buyButton = document.querySelector('.buy');

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
                } else {
                    console.error('Debe seleccionar un día y un horario antes de comprar.');
                }
            });
        } else {
            console.error('Formulario con ID myform no encontrado');
        }
    }
});
