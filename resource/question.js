const QuestionModel = require('../model/question');

class Question extends require('./base') {
    
    /**
     * Resource endpoint
     * 
     * @return {URL}
     */
    get endpoint() {
        var endpoint = this.manager.endpoint;
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
}

exports = module.exports = Question;
