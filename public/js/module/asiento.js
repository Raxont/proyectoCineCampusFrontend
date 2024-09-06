document.addEventListener('DOMContentLoaded', async () => {
    // Obtén los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idPelicula = urlParams.get('idPelicula');
    const fechaInicioFiltro = urlParams.get('fechaInicioFiltro');
    // const apiUrl = process.env.APP_API_URL ;
    const apiUrl = 'http://localhost:3000';  // Para desarrollo local

    // Verifica que los parámetros necesarios estén presentes
    if (!idPelicula || !fechaInicioFiltro) {
        console.error('Parámetros no proporcionados.');
        return;
    }
    
    let selectedDay = null; // Variable para almacenar el día seleccionado
    let selectedTime = null; // Variable para almacenar la hora seleccionada

    try {
        // Solicita los lugares disponibles para la película y la fecha especificada
        const lugaresResponse = await fetch(`${apiUrl}/lugar/lugaresPorPelicula?idPelicula=${idPelicula}&fechaInicioFiltro=${fechaInicioFiltro}`);
        const lugaresResult = await lugaresResponse.json();

        // Verifica si la respuesta fue exitosa y contiene datos
        if (lugaresResponse.status !== 200 || !lugaresResult.data || lugaresResult.data.length === 0) {
            console.error('Funciones no encontradas para la película dada.');
            return;
        }

        // Obtén el contenedor para los días y las horas
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

        // Procesa los datos recibidos para los lugares
        lugaresResult.data.forEach(lugar => {
            let fechaISO = lugar.fecha_inicio;
            let fecha = new Date(fechaISO);

            // Extrae la hora en formato UTC
            let horas = fecha.getUTCHours().toString().padStart(2, '0');
            let minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
            let hora = `${horas}:${minutos}`;

            // Extrae la fecha en formato legible
            let opcionesFecha = { weekday: 'short', month: 'short', day: '2-digit' };
            let fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFecha).replace(',', '');

            // Agrupa los horarios por fecha
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

        // Crea el HTML para los días sin duplicados
        const daysHTML = Object.keys(daysData).map(fechaFormateada => {
            const [diaSemana, diaMes, dia] = fechaFormateada.split(' ');
            return `
                <div class="container-day" data-fecha="${fechaFormateada}">
                    <small class="tittle">${diaMes}</small>
                    <div class="sub">${diaSemana}</div>
                    <div class="sub">${dia}</div>     
                </div>
            `;
        }).join('');

        // Añade el HTML de los días al contenedor
        dayContainer.innerHTML = daysHTML;

        // Añade event listeners para los días
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
                    const timesHTML = daysData[fechaSeleccionada].map(({ hora, precio, idLugar }) => {
                        // Determina el sufijo del precio basado en el valor de 'precio'
                        let precioTexto;
                        if (precio === "12.50") {
                            precioTexto = `$${precio} -2D`;
                        } else if (precio === "20") {
                            precioTexto = `$${precio} -3D`;
                        } 
                
                        return `
                            <div class="container-time" data-id="${idLugar}">
                                <div class="tittle">${hora}</div>
                                <small class="sub">${precioTexto}</small>
                            </div>
                        `;
                    }).join('');
                
                    timeContainer.innerHTML = timesHTML;
                
                    // Re-agrega event listeners para las horas después de actualizar el HTML
                    addTimeEventListeners();
                }

                updateButton();
            });
        });

        // Añade event listeners para los tiempos
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
                        try {
                            // Solicita la lista de asientos y la disponibilidad para el lugar seleccionado
                            const allasiento = await fetch(`${apiUrl}/asiento/getAsientos`);
                            const asientosResponse = await fetch(`${apiUrl}/asiento/asientosDisponibles?idLugarq=${idLugar}`);
        
                            const asientosResult = await asientosResponse.json();
                            const getasientos = await allasiento.json();           
                            
                            if (!asientosResult.success || asientosResult.data.length === 0) {
                                console.error('No hay asientos disponibles');
                                return;
                            }
                            if (!getasientos.success || getasientos.data.length === 0) {
                                console.error('No hay asientos en la base de datos');
                                return;
                            }
        
                            // Procesa la información recibida de los asientos
                            const asientosContainer = document.getElementById('asientos');
                            asientosContainer.innerHTML = '';  // Limpiar contenido previo
        
                            // Agrupa asientos por filas 
                            const asientosPorFila = {};
                            getasientos.data.forEach(asiento => {
                                const fila = asiento.codigo.charAt(0); // Obtener la letra de la fila 
                                if (!asientosPorFila[fila]) {
                                    asientosPorFila[fila] = [];
                                }
                                asientosPorFila[fila].push(asiento);
                            });
        
                            // Crea elementos HTML por cada fila
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
                                    input.setAttribute('data-incremento', asiento.incremento)
        
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
        
                                // Añade el artículo al contenedor principal
                                asientosContainer.appendChild(article);
                            });
        
                        } catch (error) {
                            console.error('Error al obtener los asientos disponibles:', error);
                        }
                    }
                    updateButton();
                    // Inicializa los listeners
                    addEventListeners(idLugar);
                });
            });
        }

        // Habilita o deshabilita el botón de compra según si se han seleccionado día y hora
        function updateButton() {
            const buyButton = document.querySelector('.buy');
            if (buyButton) {
                buyButton.disabled = !(selectedDay && selectedTime);
            }
        }

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }

    // Lógica para el formulario
    async function addEventListeners(idLugar) {
        const myform = document.querySelector('#myform');

        // Obtiene la identificación del cliente
        const response = await fetch('/api/config');
        const array = await response.json();
        cliente = Number(array.identificacion);

        if (myform) {
            myform.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (selectedDay && selectedTime) {
                    const input = new FormData(e.target);
                    const seats = [];
                    const seatIds = [];
                    let seatprice = 0;

                    // Itera sobre el FormData para obtener los valores
                    for (let [name, value] of input) {
                        if (name === 'seat' && typeof value === 'string') {
                            seats.push(value);
                            
                            // Encuentra el input checkbox correspondiente en el DOM
                            const checkbox = document.querySelector(`input[type="checkbox"][value="${value}"]`);
                            if (checkbox) {
                                const seatId = checkbox.getAttribute('data-id'); // Obtener el _id
                                seatIds.push(seatId);
                                let seattotal = checkbox.getAttribute('data-incremento'); // Obtener el incremento
                                seattotal = Number(seattotal);
                                seatprice += seattotal;
                            }
                        }
                    }
                   
                    try {
                        // Busca la información del lugar
                        const infoLugar = await fetch(`${apiUrl}/lugar/getInfoLugar?idLugar=${idLugar}`);
                        const lugarResult = await infoLugar.json();
                        const lugar = lugarResult.data[0];
                        const valor = Number(lugar.precio);
                        let cantidadAsientos = seatIds.length;
                        const total = valor * cantidadAsientos;
                        const precio = total + seatprice;

                        // Verifica si el cliente ya tiene una boleta para el lugar
                        const findboleta = await fetch(`${apiUrl}/boleta/getBoletasByClienteAndLugar?idLugar=${idLugar}&identificacionCliente=${cliente}`, {
                            method: 'GET'
                        });
                        
                        if (findboleta.ok) {
                            console.log('El cliente ya tiene creada una boleta con esa función, usa otra cuenta para reservar más asientos para esta función.');
                            return;
                        } else {
                            // Crea la boleta
                            const boletaResponse = await fetch(`${apiUrl}/boleta/agregarBoleta`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    identificacion_cliente: cliente,
                                    id_lugar: idLugar,
                                    fecha_adquisicion: new Date().toISOString(), 
                                    estado: "fisico",
                                    id_asiento: [],
                                    precio: precio
                                })
                            });
                            const price = document.querySelector('.price');
                            if (price) {
                                price.innerHTML = `
                                    <h4>Price</h4>
                                    <p>$${precio.toFixed(2)}</p>
                                `;
                            }
                            
                            const boletaResult = await boletaResponse.json();
                            const idboleta = boletaResult.data.insertedId;
                            if (boletaResponse.ok) {
                                // Luego, agrega los asientos
                                const asientosResponse = await fetch(`${apiUrl}/asiento/getReserva`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        idAsiento: seatIds,
                                        identificacionCliente: cliente,
                                        idLugar: idLugar,
                                    })
                                });
                                
                                const asientosResult = await asientosResponse.json();
                                if (asientosResponse.ok) {
                                    const userConfirmed = confirm(`El precio es $${precio}. ¿Desea continuar con la reserva del asiento?`);

                                    if (userConfirmed) {
                                        // Redirige a la página de boleta si el usuario confirma
                                        window.location.href = `${apiUrl}/tarjeta/verBoleta?identificacionCliente=${cliente}&idLugar=${idLugar}`;
                                    } else {
                                        const asientosResponsed = await fetch(`${apiUrl}/asiento/returnReserva`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                idAsiento: seatIds,
                                                identificacionCliente: cliente,
                                                idLugar: idLugar,
                                            })
                                        });
                                        await fetch(`${apiUrl}/boleta/eliminarBoleta?idBoleta=${idboleta}`, {
                                            method: 'DELETE'
                                        });
                                    }   
                                } else {
                                    console.error('Error al reservar asientos:', asientosResult);
                                }
                            } else {
                                console.error('Error al crear la boleta:', boletaResult);
                            }
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
    // Obtiene el botón de retroceso
    const backButton = document.querySelector('.back-button');
    // Agrega un evento de clic al botón
    backButton.addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const idPelicula = urlParams.get('idPelicula');
        // Redirige a la URI deseada
        window.location.href = `${apiUrl}/cliente?peliculaId=${idPelicula}`;
    });
});
