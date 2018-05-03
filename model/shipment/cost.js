var Base = require('../base');

class Cost extends Base {

    constructor(manager, cost) {
        super(manager, cost);
    }

    totalSender() {
        return this.senders.reduce((acc, val) => {
            return acc + val.cost;
        }, 0);
    }

    totalReceiver() {
        return this.receiver.cost;
    }
}

exports = module.exports = Cost;
