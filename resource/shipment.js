const ShipmentModel = require('../model/shipment');
const InvoiceModel = require('../model/invoice');

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
        super(meli, ShipmentModel);

        if (shipment)
        {
            var endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{shipment_id}', shipment);
            return this.manager.get(endpoint, ShipmentModel);
        }
    }

    get(shipment_id)
    {
        var endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('{shipment_id}', shipment_id);
        return this.manager.get(endpoint, ShipmentModel);
    }

    invoice(shipment_id, site_id)
    {
        if (!site_id)
        {
            site_id = this.manager.defaultSite();
        }

        if (!shipment_id)
        {
            throw new Error('You need to pass an shipment_id to fetch invoice_data');
        }

        var endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('{shipment_id}', shipment_id);
        endpoint.pathname += '/invoice_data';

        return this.manager.get(endpoint, InvoiceModel, { siteId: site_id });
    }
}

exports = module.exports = Shipment;
