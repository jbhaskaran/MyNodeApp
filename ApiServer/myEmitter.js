const EventEmitter = require('events');
const inherits = require('./inherit.js');

var MyEmitter = (function(_super_){
    inherits(MyEmitter, _super_)
    function MyEmitter () {
        _super_.call(this);
    }
    return MyEmitter;
})(EventEmitter);

module.exports = new MyEmitter();