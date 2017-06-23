const ItemModel = require('../model/item');

class Item extends require('./base')
{
    get endpoint()
    {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/items/{item_id}';
        return endpoint;
    }

    /**
    * Item Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, item)
    {
        super(meli);

        if (item)
        {
            var endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{item_id}', item);
            return this.manager.get(endpoint, ItemModel);
        }
    }

    search(user_id, params, per_page, page)
    {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/users/{user_id}/items/search'.replace('{user_id}', user_id);

        if (!per_page) per_page = 50;
        if (!page) page = 1;
        if (!params) params = {};

        params.offset = (per_page * (page - 1));
        params.limit  = per_page;

        return this.manager.get(endpoint, ItemModel);
    }

    all(user_id, params)
    {
       var self = this;
       return new Promise(function(resolve, reject) {
           var page = 1, items = [];

           var load = function(page) {
               return self.search(user_id, params, 100, page).then(process);
           };

           var process = function(result) {
               result.results.forEach(function(item) {
                   items.push(item);
               });
               if (result.paging.total > ((page) * 100)) {
                   page++;
                   return load(page);
               } else {
                   return resolve(items);
               }
           };

           return load(page);
       }); 
    }
}

exports = module.exports = Item;
