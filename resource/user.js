const UserModel = require('../model/user');
// const InvoiceModel = require('../model/invoice');

class User extends require('./base') {
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/users/{id}';
        return endpoint;
    }

    get endpointSearch() {
        var endpoint = this.endpoint;
        endpoint.pathname += '/items/search';
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

    me() {
        const endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('/{id}', '/me');
        return this.manager.get(endpoint, UserModel, {});
    }

    get(user_id) {
        const endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('/{id}', `/${user_id}`);
        return this.manager.get(endpoint, UserModel, {});
    }
}

exports = module.exports = User;
