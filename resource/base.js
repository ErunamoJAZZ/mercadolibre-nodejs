const Base = (function() {
    let manager = null;

    return class {
        /**
         * Base Constructor
         *
         * @param {Meli} manager
         */
        constructor(meli) {
            if (!meli) {
                throw Error('You must instance this class with an manager');
            }

            manager = meli;
        }

        /**
         * Meli Manager
         * 
         * @return {Meli} Main Module Class
         */
        get manager() {
            return manager;
        }

        /**
         * Update resource method
         * 
         * @param  {Mixed} id      Resource identification
         * @param  {Object} params Parameters to be sent within the resource
         * @return {Promise}       Promise that resolves the request to the model
         */
        update(id, params = {}) {
            let endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{id}', id);
            return this.manager.put(endpoint, params, this.model);
        }

        /**
         * Insert resource method
         * 
         * @param  {Object} params Parameters to be sent within the resource
         * @return {Promise}       Promise that resolves the request to the model
         */
        insert(params) {
            let endpoint = this.endpoint;
                endpoint.pathname = endpoint.pathname.replace('/{id}', '');
            return this.manager.post(endpoint, params, this.model);
        }

        /**
         * Get resource method
         * 
         * @param  {Mixed}  id     Resource identification
         * @param  {Object} params Parameters to be sent within the resource
         * @return {Promise}        Promise that resolves the request to the model
         */
        fetch(id = '', params = {}) {
            let endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('/{id}', id ? '/' + id : '');
            return this.manager.get(endpoint, this.model, params);
        }
    };
}());

exports = module.exports = Base;
