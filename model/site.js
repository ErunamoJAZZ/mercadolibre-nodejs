var Base = require('./base');

exports = module.exports = class Site extends Base {
    constructor(manager, site)
    {
        super(manager, site);
    }

    categories()
    {
        return this.manager.categories(this.id);
    };
}
