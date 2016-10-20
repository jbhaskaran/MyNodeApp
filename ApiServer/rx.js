var inherits = require('./inherit')
var Rx = (function() {
    var noop = function() { },
        defaultError = function(err) { throw err; };
    var Rx = {};

    function isFunction(value) {
        return typeof value === 'function' || false;
        //Object.prototype.toString.call(value) === '[object Function]';
    }

    var Scheduler = Rx.Scheduler = (function() {
        function Scheduler() {
            
        }
        Scheduler.isScheduler = function (s) {
            return s instanceof Scheduler;
        }
        Scheduler.prototype.schedule = function() {
            console.log("just here");
        }

        return Scheduler;
    }());

    (function(schedulerProto) {

        function invokeRecImmediate(pair, scheduler) {
            var state = pair[0], action = pair[1];
            action(state, innerAction);
            return;
            function innerAction(state2) {
                scheduler.schedule(state2, scheduleWork);
                function scheduleWork(state3) {
                    action(state3, innerAction);
                }
            }
        }
        schedulerProto.scheduleRecursive = function(state, action) {
            return this.schedule([state, action], invokeRecImmediate);
        }

    })(Scheduler.prototype);

    var scheduleMethod, clearMethod;
    (function() {
        var nextHandle = 1, tasksByHandle = {};
        clearMethod = function (id) {
            delete tasksByHandle[id];
        }
        function runTask(id) {
            var task = tasksByHandle[id];
            if(task) {
                var result = task();
                clearMethod(id);
            }
        }
        if(isFunction(setImmediate)) {
            scheduleMethod = function(action) {
                var id = nextHandle++;
                tasksByHandle[id] = action;
                setImmediate(function() { runTask(id) });
                return id;
            }
        }
    }());

    var MicroTaskScheduler = (function(__super__) {
    inherits(MicroTaskScheduler, __super__);
    function MicroTaskScheduler() {
        __super__.call(this);
    }

    function scheduleAction(state, action, scheduler) {
        return function schedule() {
            action(state, scheduler);
        }
    }
    MicroTaskScheduler.prototype.schedule = function(state, action) {
        var id = scheduleMethod(scheduleAction(state, action, this));
        return id;
    }
    return MicroTaskScheduler;
    })(Scheduler);

    var microTaskScheduler = Scheduler['micro'] = Scheduler.async = new MicroTaskScheduler();

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

    var Observable = Rx.Observable = (function() {
        function Observable() {

        }
        Observable.isObservable = function(o) {
            return o && isFunction(o.subscribe);
        }
        Observable.prototype.subscribe = function(onNext, onError, onCompleted) {
            return this.subscribeCore(observerCreate(onNext, onError, onCompleted));
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
            return this._scheduler.scheduleRecursive(0, scheduleMethod(o, list, this._fn));
        }
        function scheduleMethod(o, it, fn) {
            var len = it.length;
            return function loopRecursive(i, recurse) {
                if(i < len) {
                    var result = it[i];
                    o.next(result);
                    recurse(i + 1);
                }
                else {
                    o.completed();
                }

            }
        }
        return FromObservable;
    })(Observable);

    Observable.from = function(iterable, fn, scheduler) {
        Scheduler.isScheduler(scheduler) || (scheduler = microTaskScheduler);
        return new FromObservable(iterable, fn, scheduler);
    } 

    return Rx;
})();
module.exports = Rx;