let myform = document.querySelector('#myform');

myform.addEventListener('submit', (e)=>{
    e.preventDefault();
    let input = new FormData(e.target);
    let seat = [];
    for (let [name, value] of input) seat.unshift(value) 
    console.log(seat);
})