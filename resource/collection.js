const CollectionModel = require('../model/collection');

class Collection extends require('./base') {

    /**
     * Resource endpoint
     * 
     * @return {URL}
     */
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/collections/{id}';
        return endpoint;
    }

    /**
     * Returns the resource model
     * 
     * @return {Model\Base}
     */
    get model() {
        return CollectionModel;
    }

    /**
    * Collection Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, collection) {
        super(meli);

        if (collection) {
            return this.fetch(collection);
        }
    }
}

exports = module.exports = Collection;
