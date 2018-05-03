const ShipmentModel = require('../model/shipment');
const InvoiceModel = require('../model/invoice');

class Shipment extends require('./base') {
    
    /**
     * Resource endpoint
     * 
     * @return {URL}
     */
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/shipments/{id}';
        return endpoint;
    }
    
    /**
     * Resource endpoint items
     * 
     * @return {URL}
     */
    get endpointItems() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/shipments/{id}/items';
        return endpoint;
    }

    /**
     * Returns the resource model
     * 
     * @return {Model\Base}
     */
    get model() {
        return ShipmentModel;
    }

    /**
    * Shipment Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, shipment) {
        super(meli, ShipmentModel);

        if (shipment) {
            return this.fetch(shipment);
        }
    }

    /**
     * @deprecated
     */
    get(shipment_id) {
        return this.fetch(shipment_id);
    }

    /**
     * @deprecated
     */
    items(shipment_id) {
        return this.fetch(shipment_id, {}, this.endpointItems);
    }

    /**
     * [invoice description]
     * @param  {[type]} shipment_id [description]
     * @param  {[type]} site_id     [description]
     * @return {[type]}             [description]
     */
    invoice(shipment_id, site_id) {
        if (!site_id) {
            site_id = this.manager.defaultSite();
        }

        if (!shipment_id) {
            throw new Error('You need to pass an shipment_id to fetch invoice_data');
        }

        var endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('{id}', shipment_id);
        endpoint.pathname += '/invoice_data';

        return this.manager.get(endpoint, InvoiceModel, { siteId: site_id });
    }

    /**
     * [costs description]
     * @param  {[type]} shipment_id [description]
     * @return {[type]}             [description]
     */
    costs(shipment_id) {
        if (!shipment_id) {
            throw new Error('You need to pass an shipment_id to fetch costs');
        }

        var endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('{id}', shipment_id);
        endpoint.pathname += '/costs';

        return this.manager.get(endpoint, {}, { access_token: this.manager.access_token.toString() });
    }

}

exports = module.exports = Shipment;
