const UserModel = require('../model/user');
// const InvoiceModel = require('../model/invoice');

class User extends require('./base') {

    /**
     * Resource endpoint
     * 
     * @return {URL}
     */
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/users/{id}';
        return endpoint;
    }

    /**
     * Resource search endpoint
     * 
     * @return {URL}
     */
    get endpointSearch() {
        var endpoint = this.endpoint;
        endpoint.pathname += '/items/search';
        return endpoint;
    }

    /**
     * Resource search endpoint
     * 
     * @return {URL}
     */
    get endpointTest() {
        var endpoint = this.endpoint;
        endpoint.pathname += '/users/test_user';
        return endpoint;
    }

    /**
     * Returns the resource model
     * 
     * @return {Model\Base}
     */
    get model() {
        return UserModel;
    }

    /**
    * User Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, id) {
        super(meli);

        if (id) {
            return this.fetch(id);
        }
    }

    /**
     * Returns the current user
     * 
     * @return {Promise}
     */
    me() {
        return this.fetch('me');
    }

    /**
     * @deprecated
     */
    get(user_id) {
        return this.fetch(user_id);
    }

    /**
     * @deprecated
     */
    createTest(site_id) {
        return this.fetch(user_id);
    }
}

exports = module.exports = User;
