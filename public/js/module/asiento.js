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
            const [diaSemana, diaMes, dia] = fechaFormateada.split(' ');
            return `
                <div class="container-day" data-fecha="${fechaFormateada}">
                    <small class="tittle">${diaSemana}</small>
                    <div class="sub">${dia}</div>
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
                        console.log(idLugar);
                        try {
                            const allasiento = await fetch(`/asiento/getAsientos`);
                            const asientosResponse = await fetch(`/asiento/asientosDisponibles?idLugarq=${idLugar}`);
        
                            const asientosResult = await asientosResponse.json();
                            const getasientos = await allasiento.json();
                            console.log("Asientos Disponibles:",asientosResult)
                            console.log('Asientos completos',getasientos);
                            
                            
                            if (!asientosResult.success || asientosResult.data.length === 0) {
                                console.error('No hay asientos disponibles');
                                return;
                            }
                            if (!getasientos.success || getasientos.data.length === 0) {
                                console.error('No hay asientos en la base de datos');
                                return;
                            }
        
                            // Procesar la información recibida de los asientos
                            const asientosContainer = document.getElementById('asientos');
                            asientosContainer.innerHTML = '';  // Limpiar contenido previo
        
                            // Agrupar asientos por filas (ej: A, B, C, etc.)
                            const asientosPorFila = {};
                            getasientos.data.forEach(asiento => {
                                const fila = asiento.codigo.charAt(0); // Obtener la letra de la fila (A, B, etc.)
                                if (!asientosPorFila[fila]) {
                                    asientosPorFila[fila] = [];
                                }
                                asientosPorFila[fila].push(asiento);
                            });
        
                            // Crear elementos HTML por cada fila
                            Object.keys(asientosPorFila).forEach(fila => {
                                const article = document.createElement('article');
                                article.className = asientosPorFila[fila][0].tipo_fila === 'premier' ? 'asientos__preferenciales' : 'asientos__normal';
        
                                const divFila = document.createElement('div');
                                divFila.setAttribute('fila', fila);
        
                                const small = document.createElement('small');
                                small.textContent = fila;
                                divFila.appendChild(small);
        
                                const divAsientosLista = document.createElement('div');
                                divAsientosLista.className = 'asientos__lista';
        
                                let contador = 1;
                                asientosPorFila[fila].forEach(asiento => {
                                    const input = document.createElement('input');
                                    input.type = 'checkbox';
                                    input.name = 'seat';
                                    input.value = asiento.codigo;
                                    input.id = asiento.codigo;
                                    input.setAttribute('data-id', asiento._id)
        
                                    // Inicialmente marcar todos como reservados
                                    input.disabled = true;
                                    input.classList.add('reserved');
        
                                    // Si el asiento está disponible para el idLugar actual, quitar la clase reserved y habilitarlo
                                    const asientoDisponible = asientosResult.data.find(a => a.codigo === asiento.codigo);
                                    if (asientoDisponible) {
                                        input.disabled = false;
                                        input.classList.remove('reserved');
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
        if (myform) {
            myform.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (selectedDay && selectedTime) {
                    const input = new FormData(e.target);
                    const seats = [];
                    const seatIds = [];

                    // Itera sobre el FormData para obtener los valores
                    for (let [name, value] of input) {
                        // Si el campo es de tipo checkbox y su valor es una cadena de texto
                        if (name === 'seat' && typeof value === 'string') {
                            seats.push(value);
                            
                            // Encuentra el input checkbox correspondiente en el DOM
                            const checkbox = document.querySelector(`input[type="checkbox"][value="${value}"]`);
                            if (checkbox) {
                                const seatId = checkbox.getAttribute('data-id'); // Obtener el _id
                                seatIds.push(seatId);
                            }
                        }
                    }
                    
                    const dayTitle = selectedDay.querySelector('.tittle').textContent;
                    const daySub = selectedDay.querySelector('.sub').textContent;
                    const timeTitle = selectedTime.querySelector('.tittle').textContent;
                    const timeSub = selectedTime.querySelector('.sub').textContent;

                    console.log('Asientos id',seatIds);
                    console.log("Asiento enviado:", seats);
                    console.log('Selected Day enviado:', dayTitle);
                    console.log('Day Sub enviado:', daySub);
                    console.log('Selected Time enviado:', timeTitle);
                    console.log('Time Sub enviado:', timeSub);
                   
                    try {
                        // Crear la boleta
                        const boletaResponse = await fetch('/boleta/agregarBoleta', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                identificacion_cliente: 1234567890,
                                id_lugar: "66a585133098ad52758cab05",
                                fecha_adquisicion: new Date().toISOString(), // Asegúrate de usar el formato ISO
                                estado: "fisico",
                                id_asiento: [] // Puedes dejar esto vacío por ahora
                            })
                        });
                    
                        const boletaResult = await boletaResponse.json();
                        if (boletaResponse.ok) {
                            console.log('Boleta creada:', boletaResult);
                    
                            // Luego, agregar los asientos
                            const asientosResponse = await fetch('/asiento/getReserva', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    idAsiento: seatIds, // Asegúrate de que `seatIds` esté definido correctamente
                                    identificacionCliente: 1234567890,
                                    idLugar: "66a585133098ad52758cab05",
                                })
                            });
                    
                            const asientosResult = await asientosResponse.json();
                            if (asientosResponse.ok) {
                                console.log('Asientos reservados:', asientosResult);
                            } else {
                                console.error('Error al reservar asientos:', asientosResult);
                            }
                        } else {
                            console.error('Error al crear la boleta:', boletaResult);
                        }
                    } catch (error) {
                        console.error('Error en la operación:', error);
                    }
                } else {
                    alert('Por favor selecciona un día y una hora.');
                }
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento con la clase 'buy'
    const buyButton = document.querySelector('.buy');
    if (!buyButton) {
        console.error('Elemento con clase .buy no encontrado');
        return;
    }
    // Agregar un evento de clic al botón
    buyButton.addEventListener('click', function() {
        // Redirigir a la URI deseada
        // window.location.href = `http://localhost:3000/tarjeta/verBoleta?identificacionCliente=1234567890`;
    });
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


