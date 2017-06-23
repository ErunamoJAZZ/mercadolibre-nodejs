const OrderModel = require('../model/order');
const FeedbackModel = require('../model/feedback');

class Order extends require('./base')
{
    get endpoint()
    {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/orders/{order_id}';
        return endpoint;
    }

    /**
    * Order Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, order)
    {
        super(meli);

        if (order)
        {
            var endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{order_id}', order);
            return this.manager.get(endpoint, OrderModel);
        }
    }

    feedback(order, form)
    {
        if (order === undefined || form === undefined)
        {
            throw new Error('All the parameters are required, please set all of them: feedback(order, form)');
        }

        var endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('{order_id}', order) + '/feedback';
        return this.manager.post(endpoint, form, FeedbackModel);
    }
}

exports = module.exports = Order;
