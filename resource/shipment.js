const ShipmentModel = require('../model/shipment');
const CostModel = require('../model/shipment/cost');
const ItemModel = require('../model/shipment/item');
const InvoiceModel = require('../model/shipment/invoice');

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
        var endpoint = this.endpoint;
        endpoint.pathname += '/items';
        return endpoint;
    }
 
    /**
     * Resource endpoint items
     * 
     * @return {URL}
     */
    get endpointCosts() {
        var endpoint = this.endpoint;
        endpoint.pathname += '/costs';
        return endpoint;
    }

    /**
     * Resource endpoint items
     * 
     * @return {URL}
     */
    get endpointInvoice() {
        var endpoint = this.endpoint;
        endpoint.pathname += '/invoice_data';
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
    constructor(meli, shipment, load = true) {
        super(meli, ShipmentModel);

        if (shipment) {
            this.id = shipment;
            if (load) {
                return this.fetch(shipment);
            }
        }
    }

    /**
     * @deprecated
     */
    get(shipment_id) {
        return this.fetch(shipment_id);
    }

    /**
     * [items description]
     * @param  {[type]} shipment_id [description]
     * @return {[type]}             [description]
     */
    items(shipment_id) {
        return this.fetch(shipment_id, {}, this.endpointItems, ItemModel);
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

        if (!shipment_id && !this.id) {
            throw new Error('You need to pass an shipment_id to fetch invoice_data');
        }

        return this.fetch(shipment_id || this.id, { siteId: site_id }, this.endpointInvoice, InvoiceModel);
    }

    /**
     * [costs description]
     * @param  {[type]} shipment_id [description]
     * @return {[type]}             [description]
     */
    costs(shipment_id) {
        if (!shipment_id && !this.id) {
            throw new Error('You need to pass an shipment_id to fetch costs');
        }

        return this.fetch(shipment_id || this.id, { access_token: this.manager.access_token.toString() }, this.endpointCosts, CostModel);
    }

}

exports = module.exports = Shipment;
