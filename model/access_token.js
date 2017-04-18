var Base = require('./base');

exports = module.exports = class AccessToken extends Base {
    constructor(manager, accessToken)
    {
        super(manager, accessToken);
    }

    /**
    * @return Promise
    */
    refresh() {
        if (!this.refresh_token)
        {
            throw Error('We can not refresh an access_token without a refresh_token');
        }

        var self = this;
        return this.manager.auth.refreshToken(this.refresh_token).then(function(result) {
            Object.assign(self, result);
            return Promise.resolve(self);
        });
    }

    toString() {
        return this.access_token;
    }
}
