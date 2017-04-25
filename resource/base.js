var Base = (function()
{
    var manager = null;

    return class
    {
        /**
        * Base Constructor
        *
        * @param {Meli} manager
        */
        constructor(meli)
        {
            if (!meli)
            {
                throw Error('You must instance this class with an manager');
            }

            manager = meli;
        }

        get manager()
        {
            return manager;
        }
    };
}());

exports = module.exports = Base;
