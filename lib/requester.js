const request = require('request');
const https   = require('https');
const URL     = require('url');
const Url     = require('url').Url;
const events  = require('events');
const AccessToken = require('../model/access_token');

https.globalAgent.options = {
    ciphers: 'ALL',
    securityOptions: 'SSL_OP_NO_SSLv3'
}

module.exports = class extends events.EventEmitter
{
    constructor()
    {
        super();
    }

    get(resource, Model)
    {
        return this.request('get', resource, undefined, Model);
    }

    post(resource, form, Model)
    {
        return this.request('post', resource, form, Model);
    }

    _prepareBodyReturn(body, Model)
    {
        if (body.length)
        {
            for(var i in body)
            {
                if (body[i])
                {
                    body[i] = new Model(self, body[i]);
                }
            }
        }
        else
        {
            body = new Model(self, body);
        }

        return body;
    }

    doRequest(method, resource, formData, Model, accessToken)
    {
        var self = this;
        return new Promise(function(fulfill, reject)
        {
            var uri = {};
            if (typeof resource === 'string')
            {
                var endpoint = self.endpoint;
                endpoint.pathname = resource;
                uri = endpoint;
            }
            else
            {
                Object.assign(uri, resource);
            }

            if (accessToken)
            {
                uri.query['access_token'] = accessToken.toString();
            }

            uri = {
                uri: URL.format(uri)
            };

            if (method.toLowerCase() !== 'get')
            {
                uri['form'] = {};
                if (formData)
                {
                    uri['form'] = formData;
                }
            }

            return request[method](uri, function(err, response, body)
            {
                const statusCode = response && response.statusCode ?
                response.statusCode : 500;
                var isJson = true;

                try { body = JSON.parse(body); } catch(e) { isJson = false; }

                if (Model && isJson)
                {
                    self._prepareBodyReturn(body, Model);
                }

                if (err)
                {
                    var error = new Error(err);
                    error.body = body;
                    error.statusCode = statusCode;
                    throw error;
                }

                if (statusCode >= 200 && statusCode < 300)
                {
                    return fulfill(body);
                }

                return reject(body);
            });
        });
    }

    request(method, resource, formData, Model)
    {
        var self = this, localRequest;
        if (Model === AccessToken)
        {
            localRequest = self.doRequest(method, resource, formData, Model);
        }
        else
        {
            localRequest = self.auth.accessToken.then(function(accessToken) {
                return self.doRequest(method, resource, formData, Model, accessToken);
            });
        }

        return localRequest.catch(function(response) {
            if (response.error && response.status === 401)
            {
                self.access_token.is_valid = false;
                return self.request(method, resource, formData, Model);
            }

            return Promise.resolve(response);
        });
    }

};
