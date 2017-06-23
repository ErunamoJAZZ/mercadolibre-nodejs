const MessageModel = require('../model/message');

class Message extends require('./base')
{
    get endpoint()
    {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/messages/{message_id}';
        return endpoint;
    }

    /**
    * Message Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, message)
    {
        super(meli);

        if (message)
        {
            var endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{message_id}', message);
            return this.manager.get(endpoint, MessageModel);
        }
    }
}

exports = module.exports = Message;
