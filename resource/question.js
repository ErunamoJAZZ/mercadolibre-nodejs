const QuestionModel = require('../model/question');

class Question extends require('./base') {
    get endpoint() {
        var endpoint = this.manager.endpoint;
        endpoint.pathname = '/questions/{question_id}';
        return endpoint;
    }

    /**
    * Question Constructor
    *
    * @param {Meli} manager
    */
    constructor(meli, question) {
        super(meli);

        if (question) {
            var endpoint = this.endpoint;
            endpoint.pathname = endpoint.pathname.replace('{question_id}', question);
            return this.manager.get(endpoint, QuestionModel);
        }
    }
}

exports = module.exports = Question;
