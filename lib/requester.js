const request = require('request');
const https   = require('https');
const URL     = require('url');
const Url     = require('url').Url;
const EventEmitter  = require('events').EventEmitter;
const AccessToken = require('../model/access_token');

https.globalAgent.options = {
    ciphers: 'ALL',
    securityOptions: 'SSL_OP_NO_SSLv3',
};

module.exports = class extends EventEmitter
{
    constructor()
    {
        super();
    }

    get(resource, Model, params)
    {
        return this.request('get', resource, params, undefined, Model);
    }

    post(resource, form, Model, params)
    {
        return this.request('post', resource, params, form, Model);
    }

    _prepareBodyReturn(body, Model)
    {
        var paging = false;
        if (body.results && body.paging)
        {
            paging = body.paging;
            body = body.results;
        }

        if (body.length)
        {
            for(var i in body)
            {
                if (body[i] && typeof body[i] !== 'string')
                {
                    body[i] = new Model(this, body[i]);
                }
            }
        }
        else
        {
            body = new Model(this, body);
        }

        if (paging)
        {
            body = { results: body, paging: paging };
        }

        return body;
    }

    doRequest(method, resource, params, formData, Model, accessToken)
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

            if (params)
            {
                for(var i in params)
                {
                    uri.query[i] = params[i];
                }
            }

            uri = {
                uri: URL.format(uri)
            };

            if (method.toLowerCase() !== 'get')
            {
                if (formData)
                {
                    if (typeof formData === 'object' && formData.forEach === undefined) {
                        uri['body'] = JSON.stringify(formData);
                    } else {
                        uri['form'] = formData;
                    }
                }
            }

            return request[method](uri.uri, uri, function(err, response, body)
            {
                const statusCode = response && response.statusCode ?
                response.statusCode : 500;
                var isJson = true;

                try { body = JSON.parse(body); } catch(e) { isJson = false; }

                if (Model && isJson)
                {
                    body = self._prepareBodyReturn(body, Model);
                }

                if (body.status && body.status < 200 && body.status > 299)
                {
                    statusCode = body.status;
                    err = body;
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

    request(method, resource, params, formData, Model)
    {
        var self = this, localRequest;
        if (Model === AccessToken)
        {
            localRequest = self.doRequest(method, resource, params, formData, Model);
        }
        else
        {
            localRequest = self.auth.accessToken.then(function(accessToken) {
                return self.doRequest(method, resource, params, formData, Model, accessToken);
            });
        }

        return localRequest.catch(function(response) {
            if (response.error && response.status === 401)
            {
                self.access_token.is_valid = false;
                return self.request(method, resource, params, formData, Model);
            }

            return Promise.resolve(response);
        });
    }

};
