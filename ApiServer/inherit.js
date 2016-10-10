module.exports = function inherit(child, parent) {
    function __() {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    }
    __();
};