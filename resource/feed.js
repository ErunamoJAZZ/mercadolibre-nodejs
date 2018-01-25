const FeedModel = require('../model/feed');

class Feed extends require('./base') {

    /**
     * Resource endpoint
     * 
     * @return {URL}
     */
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/myfeeds';
        return endpoint;
    }

    /**
     * Returns the resource model
     * 
     * @return {Model\Base}
     */
    get model() {
        return FeedModel;
    }

    /**
    * Message Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, app_id) {
        super(meli);
        this.app_id = app_id;
    }

    get(limit, offset, before, after) {
        var self = this;
        var params = {
            app_id: this.app_id
        };

        if (limit && limit > 10) {
            params.limit = limit;
        }

        if (offset && offset > 10) {
            params.offset = offset;
        }

        if (before) {
            params.before = before;
        }

        if (after) {
            params.after = after;
        }

        return this.fetch().then((ret) => {
            const messages = ret.messages;
            const notifications = [];

            messages.forEach((notification) => {
                notifications.push(new FeedModel(self.manager, notification));
            });

            return Promise.resolve(notifications);
        });
    }
}

exports = module.exports = Feed;
