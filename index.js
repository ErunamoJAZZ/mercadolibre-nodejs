const URL         = require('url');
const Requester   = require('./lib/requester');
const Auth        = require('./resource/auth');
const Item        = require('./resource/item');
const Order       = require('./resource/order');
const Collection  = require('./resource/collection');
const Meli        = (function() {

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
        };

        get endpoint()
        {
            return new URL.parse(endpoint, true);
        };

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
        };

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

            const Site = require('./model/site');
            return this.get('/sites' + site_id, Site);
        };

        categories(site_id)
        {
            if (!site_id)
            {
                site_id = this.defaultSite();
            }

            const Category  = require('./model/category');
            return this.get('/sites/' + site_id + '/categories', Category);
        };

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
   }
}());

exports = module.exports = Meli;
