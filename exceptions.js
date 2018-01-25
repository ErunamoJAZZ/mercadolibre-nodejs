class ApiException extends Error {
    constructor(message, body, statusCode) {
         super(message);
         this.body = body;
         this.statusCode = statusCode;
         this.name = 'ApiException';
    }
}

class RequestException extends ApiException {
    constructor(message, body, statusCode) {
         super(message, body, statusCode);
         this.name = 'RequestException';
    }
}

exports = module.exports = {
    ApiException,
    RequestException
}
