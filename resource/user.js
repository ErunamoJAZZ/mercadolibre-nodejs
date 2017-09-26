const UserModel = require('../model/shipment');
// const InvoiceModel = require('../model/invoice');

class User extends require('./base') {
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/user/{id}';
        return endpoint;
    }

    /**
    * User Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, id) {
        super(meli, UserModel, id);

        this.id = id;
    }

    endpointSearch() {
        var endpoint = this.endpoint;
        endpoint.pathname += '/items/search';
        return endpoint;
    }

    items(statuses, limit, page) {
        if (!statuses) {
            statuses = [];
        }

        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 100;
        }

        if (limit == 'all') {
            throw new Error('This is a @TODO');
        }

        let offset = (50 * (page - 1)); 

        let params = {
            page: page,
            limit: limit,
            offset: offset
        };

        if (statuses.length) {
            params['status'] = statuses.join(',');
        }

        return this.manager.get(this.endpointSearch(), undefined, params);
    }
}

exports = module.exports = User;
