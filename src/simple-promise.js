// es6标准的promise的实现（只供学习）
// 曾文彬
'use strict';

function SimplePromise (fn) {
    this.doneList = [];
    this.state = 'pending';
    this.args = null;
    this.promise = this;

    fn(this.resolve.bind(this));
}

SimplePromise.prototype.resolve = function () {
    var args = [].slice.call(arguments);

    while (true) {
        if (!this.doneList.length) {
            this.state = 'done';
            break;
        }

        if( args[0] instanceof SimplePromise ){
            this.promise = args[0];
            this.promise.doneList = args[0].doneList.concat(this.doneList);
            this.promise.resolve.apply(this.promise, this.promise.args);
            this.doneList.length = 0;
            this.state = 'done';
            break;
        }

        args = [this.doneList.shift().apply(this, args)];
    }

    this.args = args;
};

SimplePromise.prototype.then = function (callback) {
    this.doneList.push(callback);


    if (this.state === 'done') {
        this.state = 'pending';
        this.resolve.apply(this, this.args);
    }

    return this.promise;
};

SimplePromise.prototype.catch = function () {

};
