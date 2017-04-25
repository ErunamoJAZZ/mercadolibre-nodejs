const CollectionModel = require('../model/collection');

class Collection extends require('./base')
{
    get endpoint()
    {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/collections/{collection_id}';
        return endpoint;
    }

    /**
    * Collection Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, collection)
    {
        super(meli);

        if (collection)
        {
            var endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{collection_id}', collection);
            return this.manager.get(endpoint, CollectionModel);
        }
    }
}

exports = module.exports = Collection;
