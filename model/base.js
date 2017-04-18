exports = module.exports = (function() {
    var manager;

    return class Base {
        constructor(meli, data)
        {
            manager = meli;
            Object.assign(this, data);
        }

        get manager()
        {
            return manager;
        }
    }
}());
