/*var fibonacci = function(n) {
var one = 0;
var two = 1;
for(var i = 0; i < n; i++) {
    var next = one + two;
    one = two;
    two = next;
}
//return 234; 
}
*/
console.log("Child Process " + process.argv[2] + " executed." );
process.on('message', (m) => {
  console.log('CHILD got message:', m);
});
process.send({ foo: 'bar' });