const http = require('http');
const fs = require('fs');
const myEmitter = require('./myEmitter.js');
const cp = require('child_process');
//const spawn = require('child_process').spawn;
const pq = require('./priorityQueue');
//const rx = require('./rx');
const Rx = require('./rx.lite.js');

const hostname = '127.0.0.1';
const port = 3000;

// Using a function
var source = Rx.Observable.from([1,2,3])
    .select(function (x, idx, obs) {
        return x * x;
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

/*const wp = cp.fork(`${__dirname}/fibonacci.js`, [100], {
   execArgv: ['--debug-brk=6001']
});*/
/*const wp = cp.fork(`${__dirname}/fibonacci.js`, [100]);
wp.on('message', function(data) {
 console.log('stdout: ' + data);
 console.log('parent got message: '+ data.foo);
});

wp.send({ hello: 'world' });*/

const pq1 = new pq();
pq1.enqueue({val: 'Eason', priority: 5});
pq1.enqueue({val: 'Chung', priority: 3});
pq1.enqueue({val: 'Flynn', priority: 6});
pq1.enqueue({val: 'Dunne', priority: 4});
pq1.enqueue({val: 'Aiden', priority: 1});
pq1.enqueue({val: 'Baker', priority: 2});
pq1.print();
let isPq = pq1.isPriorityQueue();
let item = pq1.dequeue();
pq1.print();
item = pq1.dequeue();
pq1.print();
isPq = pq1.isPriorityQueue();

myEmitter.on('event', function() {
  console.log('an event occured');
});



const server = http.createServer((req, res) => {
  myEmitter.emit('event');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});