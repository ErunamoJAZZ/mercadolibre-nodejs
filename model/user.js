var Base = require('./base');

class User extends Base {
    constructor(manager, user) {
        super(manager, user);
    }
}

exports = module.exports = User;
