const Base = require('./base');
const OrderModel = require('../model/order');

class Order extends Base
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
}

exports = module.exports = Order;
