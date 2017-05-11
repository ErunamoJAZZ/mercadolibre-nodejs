const ShipmentModel = require('../model/shipment');

class Shipment extends require('./base')
{
    get endpoint()
    {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/shipments/{shipment_id}';
        return endpoint;
    }

    /**
    * Shipment Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, shipment)
    {
        super(meli);

        if (shipment)
        {
            var endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{shipment_id}', shipment);
            return this.manager.get(endpoint, ShipmentModel);
        }
    }
}

exports = module.exports = Shipment;
