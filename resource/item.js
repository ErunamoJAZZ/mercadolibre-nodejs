const ItemModel = require('../model/item');

class Item extends require('./base')
{
    get endpoint()
    {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/items/{item_id}';
        return endpoint;
    }

    /**
    * Item Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, item)
    {
        super(meli);

        if (item)
        {
            var endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{item_id}', item);
            return this.manager.get(endpoint, ItemModel);
        }
    }
}

exports = module.exports = Item;
