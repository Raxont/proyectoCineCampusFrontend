document.addEventListener('DOMContentLoaded', function() {
    let myform = document.querySelector('#myform');
    let selectedDay = null;
    let selectedTime = null;
    let days = document.querySelectorAll('.container-day');
    let times = document.querySelectorAll('.container-time');
    let buyButton = document.querySelector('.buy');

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

    if (myform) {
        myform.addEventListener('submit', (e) => {
            e.preventDefault();
            if (selectedDay && selectedTime) {
                let input = new FormData(e.target);
                let seat = [];
                for (let [name, value] of input) seat.unshift(value);
                
                let dayTitle = selectedDay.querySelector('.tittle').textContent;
                let daySub = selectedDay.querySelector('.sub').textContent;
                let timeTitle = selectedTime.querySelector('.tittle').textContent;
                let timeSub = selectedTime.querySelector('.sub').textContent;

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
});
