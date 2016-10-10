var content = document.querySelector("#content span");
window.addEventListener("message", function(ev) {
    content.textContent = ev.data;
    console.log(ev.source);
    ev.source.postMessage('Hi Parent', 'http://localhost:5000');
}, false);






