const MessageModel = require('../model/message');

class Message extends require('./base') {
    
    /**
     * Resource endpoint
     * 
     * @return {URL}
     */
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/messages/{id}';
        return endpoint;
    }

    /**
     * Returns the resource model
     * 
     * @return {Model\Base}
     */
    get model() {
        return MessageModel;
    }

    /**
    * Message Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, message) {
        super(meli);

        if (message) {
            return this.fetch(message);
        }
    }
}

exports = module.exports = Message;
