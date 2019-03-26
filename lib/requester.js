const request = require("request");
const https = require("https");
const URL = require("url");
const EventEmitter = require("events").EventEmitter;
const AccessToken = require("../model/access_token");
const RequestException = require("../exceptions").RequestException;

https.globalAgent.options = {
    ciphers: "ALL",
    securityOptions: "SSL_OP_NO_SSLv3",
};

module.exports = class extends EventEmitter {
    constructor() {
        super();
    }

    get(resource, Model, params) {
        return this.request("get", resource, params, undefined, Model);
    }

    post(resource, form, Model, params) {
        return this.request("post", resource, params, form, Model);
    }

    put(resource, form, Model, params) {
        return this.request("put", resource, params, form, Model);
    }

    _prepareParams(resource, params = {}) {
        if (!(typeof resource !== "string")) {
            return resource;
        }
        let uri = resource;
        let urlParts = uri.matchAll(/\{(.*)\}/g).next();
        while (!urlParts.done) {
            const [full, param] = urlParts.value;
            if (full && param && params[param] !== undefined) {
                uri = uri.replace(
                    `/${full}`,
                    params[param] !== "" ? `/${params[param]}` : "",
                );
                delete params[param];
            }
        }

        return uri;
    }

    _prepareBodyReturn(body, Model) {
        var paging = false;
        if (body.results && body.paging) {
            paging = body.paging;
            body = body.results;
        }

        if (body.error) {
            let error = new Error(body.error);
            error.body = body;
            throw error;
        }

        if (body.length) {
            for (var i in body) {
                if (body[i] && typeof body[i] !== "string") {
                    body[i] = new Model(this, body[i]);
                }
            }
        } else {
            body = new Model(this, body);
        }

        if (paging) {
            body = { results: body, paging: paging };
        }

        return body;
    }

    doRequest(method, resource, params, formData, Model, accessToken) {
        var self = this;
        return new Promise(function(fulfill, reject) {
            var opts = {};
            if (typeof resource === "string") {
                var endpoint = self.endpoint;
                endpoint.pathname = resource;
                opts = endpoint;
            } else {
                Object.assign(opts, resource);
            }

            if (accessToken) {
                opts.query["access_token"] = accessToken.toString();
            }

            if (params) {
                for (var i in params) {
                    opts.query[i] = params[i];
                }
            }

            opts = {
                url: URL.format(opts),
                agentOptions: https.globalAgent.options,
            };

            if (method.toLowerCase() !== "get" && formData) {
                if (
                    typeof formData === "object" &&
                    formData.forEach === undefined
                ) {
                    opts["body"] = JSON.stringify(formData);
                } else {
                    opts["form"] = formData;
                }
            }

            if (!opts.headers) {
                opts.headers = {};
            }

            opts.headers["Content-Type"] = "application/json";

            if (self.useNewFormat) {
                opts.headers["x-format-new"] = true;
            }

            return request[method](opts, function(err, response, body) {
                let statusCode =
                    response && response.statusCode ? response.statusCode : 500;
                var isJson = true,
                    error = err,
                    parsedBody = body;

                try {
                    parsedBody = JSON.parse(body);
                } catch (e) {
                    isJson = false;
                }

                try {
                    if (
                        parsedBody &&
                        parsedBody.status &&
                        (parsedBody.status < 200 || parsedBody.status > 299)
                    ) {
                        statusCode = parsedBody.status;
                        error = parsedBody;
                    }

                    if (!error && Model && isJson) {
                        parsedBody = self._prepareBodyReturn(parsedBody, Model);
                    }

                    if (error) {
                        parsedBody = new RequestException(
                            error.message,
                            parsedBody,
                            statusCode,
                        );
                    }

                    if (!error && statusCode >= 200 && statusCode < 300) {
                        return fulfill(parsedBody);
                    } else {
                        throw Error(
                            `Response failed with statusCode ${statusCode} and body: ${body}`,
                        );
                    }
                } catch (e) {
                    parsedBody = new RequestException(
                        e.message,
                        parsedBody,
                        statusCode,
                    );

                    // throw parsedBody;
                }

                return reject(parsedBody);
            });
        });
    }

    request(method, resource, params, formData, Model) {
        var self = this,
            localRequest;

        if (Model === AccessToken) {
            localRequest = self.doRequest(
                method,
                resource,
                params,
                formData,
                Model,
            );
        } else {
            localRequest = self.auth.accessToken.then(function(accessToken) {
                return self.doRequest(
                    method,
                    resource,
                    params,
                    formData,
                    Model,
                    accessToken,
                );
            });
        }

        return localRequest.catch(function(response) {
            if (response.statusCode === 401 || response.statusCode === 403) {
                self.access_token.is_valid = false;
                return self.request(method, resource, params, formData, Model);
            }

            return Promise.resolve(response);
        });
    }
};
