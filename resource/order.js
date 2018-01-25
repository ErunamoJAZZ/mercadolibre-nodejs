const OrderModel = require('../model/order');
const FeedbackModel = require('../model/feedback');

class Order extends require('./base') {
    
    /**
     * Resource endpoint
     * 
     * @return {URL}
     */
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/orders/{id}';
        return endpoint;
    }

    /**
     * Returns the resource model
     * 
     * @return {Model\Base}
     */
    get model() {
        return OrderModel;
    }

    /**
    * Order Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, order) {
        super(meli);

        if (order) {
            return this.fetch(order);
        }
    }

    feedback(order, form) {
        if (order === undefined || form === undefined) {
            throw new Error('All the parameters are required, please set all of them: feedback(order, form)');
        }

        var endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('{id}', order) + '/feedback';
        return this.manager.post(endpoint, form, FeedbackModel);
    }
}

exports = module.exports = Order;
