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
        Scheduler.prototype.schedule = function() {
            console.log("just here");
        }

        return Scheduler;
    }());

    (function(schedulerProto) {

        function invokeRecImmediate(scheduler, action) {
            function innerAction() {
                scheduler.schedule(action, scheduleWork);
                function scheduleWork() {
                    action(innerAction);
                }
            }
        }
        schedulerProto.scheduleRecursive = function(action) {
            return this.schedule(action, invokeRecImmediate);
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

    function scheduleAction(action, scheduler) {
        return function schedule() {
            action(scheduler);
        }
    }
    MicroTaskScheduler.prototype.schedule = function(action) {
        var id = scheduleMethod(scheduleAction(action, this));
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
    })(Observable);
    return Rx;
})();
module.exports = Rx;