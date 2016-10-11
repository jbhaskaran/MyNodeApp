var inherits = require('./inherits')
(function() {
    var noop = function() { },
        defaultError = function(err) { throw err; };

    function isFunction(value) {
        return typeof value === 'function' || false;
        //Object.prototype.toString.call(value) === '[object Function]';
    }

    var Scheduler = (function() {
        function Scheduler(timeout, fn) {
            this._timeout = timeout || 0;
            this._fn = fn;
        }
        Scheduler.prototype.schedule = function() {
            setTimeout(function() {
                this._fn();
            }, this._timeout);
        }
        return Scheduler;
    }());

    var MicroTaskScheduler = (function(__super__) {
        inherits(MicroTaskScheduler, __super__);
        function MicroTaskScheduler(timeout, fn) {
            __super__.call(this, timeout, fn);
        }
        return MicroTaskScheduler;
    })(Scheduler);

    var Observer = function () { };
    var observerCreate = Observer.create = function(onNext, onError, onCompleted) {
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
        Observable.isObservable = function(o) {
            return o && isFunction(o.subscribe);
        }
        Observable.prototype.subscribe = function(onNext, onError, onCompleted) {
            return this._subscribe(observerCreate(onNext, onError, onCompleted));
        }
        return Observable;
    }());

    var FromObservable = (function(__super__) {
        inherits(FromObservable, __super__);
        function FromObservable(iterable, fn, scheduler) {
            this._iterable = iterable;
            this._fn = fn;
            this._scheduler = scheduler;
            __super__.call(this);
        }
        FromObservable.prototype.subscribeCore = function(o) {
            let list = Object(this._iterable);
            return this._scheduler.schedule(0, createScheduleMethod(o, list, this._fn));
        }
        function createScheduleMethod(o, it, fn) {
            return function loopRecursive() {
                
            }
        }
        return FromObservable;
    })();

}.call(this));