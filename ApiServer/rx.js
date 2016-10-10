
var inherits = require('./inherits')
(function() {
    var noop = function() { },
        defaultError = function(err) { throw err; };

    var Observer = function () { };
    Observer.create = function(onNext, onError, onCompleted) {
        onNext = onNext || (onNext = noop);
        onError = onError || (onError = defaultError);
        onCompleted = onCompleted || (onCompleted = noop);
        return new AnonymousObserver(onNext, onError, onCompleted);
    }

    var AnonymousObserver = (function(__super__){
        inherits(AnonymousObserver, __super__);
        function AnonymousObserver(onNext, onError, onCompleted) {
            __super__.call(this);
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted;
        }
        AnonymousObserver.prototype.next = function(value) {
            this._onNext(value);
        }
        AnonymousObserver.prototype.error = function(error) {
            this._onError(error);
        }
        AnonymousObserver.prototype.completed = function() {
            this._onCompleted();
        }
        return AnonymousObserver;
    })(Observer);

    var Observable = (function(){
        function Observable() {

        }
        return Observable;
    }());



}.call(this));





