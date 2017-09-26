var Base = require('./base');

exports = module.exports = class Invoice extends Base {
    constructor(manager, shipment) {
        super(manager, shipment);
    }
};
