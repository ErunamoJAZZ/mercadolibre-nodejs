const QuestionModel = require('../model/question');

class Question extends require('./base') {
    
    /**
     * Resource endpoint
     * 
     * @return {URL}
     */
    get endpoint() {
        let endpoint = this.manager.endpoint;
        endpoint.pathname = '/questions/{id}';
        return endpoint;
    }

    /**
     * Returns the resource model
     * 
     * @return {Model\Base}
     */
    get model() {
        return QuestionModel;
    }

    /**
    * Question Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, question) {
        super(meli);

        if (question) {
            return this.fetch(question);
        }
    }

    search(user_id, params, per_page, offset, scroll_id) {
        let endpoint = this.endpoint;
        endpoint.pathname = endpoint.pathname.replace('/{id}', '/search');

        if (!per_page) per_page = 100;
        if (!params) params = {};
        if (user_id) params.seller_id = user_id;
        if (offset) params.offset = offset;
        if (scroll_id) params.scroll_id = scroll_id;

        params.search_type = 'scan';
        params.limit  = per_page;
        return this.manager.get(endpoint, this.model, params);
    }

    all(user_id, params) {
        let self = this;

        return new Promise(function(resolve, reject) {
            let questions = [];

            if (!user_id) {
                throw new Error('user_id parameter is required');
            }

            let load = function(scroll_id) {
                return self.search(user_id, params, 100, undefined, scroll_id).then(process);
            };

            let process = function(result) {
                if (result.questions && result.questions.length) {
                    result.questions.forEach(function(item) {
                        questions.push(item);
                    });
                    return load(result.scroll_id);
                }
                return Promise.resolve(questions);
            };

            return load().then(() => {
                resolve(questions);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

exports = module.exports = Question;
