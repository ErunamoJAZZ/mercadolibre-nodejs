const request = require('request');
const https   = require('https');
const URL     = require('url');
const Url     = require('url').Url;

https.globalAgent.options = {
    ciphers: 'ALL',
    securityOptions: 'SSL_OP_NO_SSLv3'
}

module.exports = class
{
    constructor()
    {
    }

    get(resource, Model)
    {
        var self = this;
        return new Promise(function(fulfill, reject)
        {
            if (!(resource instanceof Url))
            {
                var endpoint = self.endpoint;
                endpoint.pathname = resource;
                resource = endpoint;
            }

            if (self.access_token)
            {
                resource.query['access_token'] = self.access_token.toString();
            }

            resource = URL.format(resource);
            request.get(resource, function(err, response, body)
            {
                const statusCode = response && response.statusCode ?
                                   response.statusCode : 500;
                var isJson = true;

                try { body = JSON.parse(body); } catch(e) { isJson = false; }

                if (statusCode >= 200 && statusCode < 300)
                {
                    if (Model && isJson)
                    {
                        if (body.length)
                        {
                            for(var i in body)
                            {
                                body[i] = new Model(self, body[i]);
                            }
                        }
                        else
                        {
                            body = new Model(self, body);
                        }
                    }
                    return fulfill(body);
                }

                return reject(body);
            });
        });
    }

    post(resource, form, Model)
    {
        var self = this;
        return new Promise(function(fulfill, reject)
        {
            if (!(resource instanceof Url))
            {
                var endpoint = self.endpoint;
                endpoint.pathname = resource;
                resource = endpoint;
            }

            if (self.access_token)
            {
                resource.query['access_token'] = self.access_token.toString();
            }

            resource = {
                uri: URL.format(resource),
                form: {}
            };

            if (form)
            {
                resource['form'] = form;
            }

            request.post(resource, function(err, response, body)
            {
                const statusCode = response && response.statusCode ?
                                   response.statusCode : 500;
                var isJson = true;

                try { body = JSON.parse(body); } catch(e) { isJson = false; }

                if (statusCode >= 200 && statusCode < 300)
                {
                    if (Model && isJson)
                    {
                        if (body.length)
                        {
                            for(var i in body)
                            {
                                body[i] = new Model(self, body[i]);
                            }
                        }
                        else
                        {
                            body = new Model(self, body);
                        }
                    }
                    return fulfill(body);
                }

                return reject(body);
            });
        });
    }
};
