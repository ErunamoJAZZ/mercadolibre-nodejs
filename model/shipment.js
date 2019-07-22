var Base = require('./base');
// var ShipmentResource = require('../resource/shipment');

class Shipment extends Base {
    constructor(manager, shipment) {
        super(manager, shipment);
    }

    invoice() {
        return this.manager.shipment().invoice(this.id, this.site_id);
    }
}

exports = module.exports = Shipment;
