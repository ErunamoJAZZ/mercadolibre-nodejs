// Dependencies
const URL         = require('url');
const Requester   = require('./lib/requester');

// Resources
const Auth        = require('./resource/auth');
const Item        = require('./resource/item');
const Order       = require('./resource/order');
const Collection  = require('./resource/collection');
const Question    = require('./resource/question');
const Shipment    = require('./resource/shipment');
const Message     = require('./resource/message');

// Models
const Site        = require('./model/site');
const Category    = require('./model/category');

const Meli        = (function()
{

    var site = 'MLB';
    var endpoint = "https://api.mercadolibre.com/";

    /**
     * Entrance class wrapper
     *
     * @version 0.0.1
     */
    return class extends Requester
    {

        /**
         * Meli Constructor
         *
         * @param {number} client_id
         * @param {string} client_secret
         * @param {string} [access_token]
         * @param {string} [refresh_token]
         */
        constructor(... args)
        {
            super();

            if (args.length < 2)
            {
                throw Error('You must set at least client_id and client_secret');
            }

            this.client_id     = args.shift();
            this.client_secret = args.shift();
            this.access_token  = Auth.createAccessToken(this, {
                access_token:  args.shift(),
                refresh_token: args.shift()
            });
        }

        get endpoint()
        {
            return new URL.parse(endpoint, true);
        }

        /**
         * Change or return the site used by this wrapper
         *
         * @param {string} [site_id]
         * @return {Meli}
         */
        defaultSite(site_id)
        {
            if (!site_id)
            {
                return site;
            }

            site = site_id.toUpperCase();
            return this;
        }

        site(site_id)
        {
            if (site_id)
            {
                site_id = '/' + site_id;
            }
            else
            {
                site_id = '';
            }

            return this.get('/sites' + site_id, Site);
        }

        categories(site_id)
        {
            if (!site_id)
            {
                site_id = this.defaultSite();
            }

            return this.get('/sites/' + site_id + '/categories', Category);
        }

        get auth()
        {
            return new Auth(this);
        }

        item(item_id)
        {
            return new Item(this, item_id);
        }

        order(order_id)
        {
            return new Order(this, order_id);
        }

        collection(collection_id)
        {
            return new Collection(this, collection_id);
        }

        question(question_id)
        {
            return new Question(this, question_id);
        }

        shipment(shipment_id)
        {
            return new Shipment(this, shipment_id);
        }

        message(message_id)
        {
            return new Message(this, message_id);
        }

        messages(message_id)
        {
            return this.message(message_id);
        }

        items(item_id)
        {
            return this.item(item_id);
        }

        orders(order_id)
        {
            return this.order(order_id);
        }

        collections(collection_id)
        {
            return this.collection(collection_id);
        }

        questions(question_id)
        {
            return this.question(question_id);
        }

        shipments(shipment_id)
        {
            return this.shipment(shipment_id);
        }

        resource(resource)
        {
            var parts = resource.split('/');
            var id = parts.pop();
            resource = parts.pop();

            return this[resource](id);
        }

        // Proxies
        payment(payment_id)
        {
            return this.collection(payment_id);
        }

        payments(payment_id)
        {
            return this.payment(payment_id);
        }

   }
}());

exports = module.exports = Meli;
