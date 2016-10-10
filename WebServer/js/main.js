var number = document.querySelector('#number');
var click = document.querySelector('#click');
var popup; 

if(window.Worker) {
    var myWorker = new Worker('js/worker.js');
    myWorker.postMessage(number.value);
    myWorker.onmessage = function(data) {
        console.log('Worker data: ' + data);
    }
}

click.addEventListener('click', function() {
    popup = window.open('popup.html');
    popup.addEventListener("message", function(ev){
        alert('main received msg: '+ ev.data);
    });
});

setTimeout(function() {
    popup.postMessage('Hi Child', 'http://localhost:5000');
    }, 3000);









