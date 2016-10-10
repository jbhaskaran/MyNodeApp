onmessage = function(event) {
    console.log('Message received from main');
    console.log(event.data);
    postMessage(event.data * 1000);
}