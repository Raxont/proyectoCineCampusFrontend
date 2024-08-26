document.addEventListener('DOMContentLoaded', function() {
    let myform = document.querySelector('#myform');

    if (myform) {
        myform.addEventListener('submit', (e) => {
            e.preventDefault();
            let input = new FormData(e.target);
            let seat = [];
            for (let [name, value] of input) {
                seat.unshift(value);
            }
            console.log(seat);
        });
    } else {
        console.error('Elemento con ID myform no encontrado');
    }
});
