const AccessToken = require('../model/access_token');
const URL = require('url');

class Auth extends require('./base') {
    get auth_endpoint() {
        return {
            'MLA': 'https://auth.mercadolibre.com.ar', // Argentina
            'MLB': 'https://auth.mercadolivre.com.br', // Brasil
            'MBO': 'https://auth.mercadolibre.com.bo', // Bolivia
            'MCU': 'https://auth.mercadolibre.com.cu', // Cuba
            'MLC': 'https://auth.mercadolibre.cl',     // Chile
            'MCO': 'https://auth.mercadolibre.com.co', // Colombia
            'MCR': 'https://auth.mercadolibre.com.cr', // Costa Rica
            'MRD': 'https://auth.mercadolibre.com.do', // Dominicana
            'MEC': 'https://auth.mercadolibre.com.ec', // Ecuador
            'MSV': 'https://auth.mercadolibre.com.sv', // El Salvador
            'MGT': 'https://auth.mercadolibre.com.gt', // Guatemala
            'MHN': 'https://auth.mercadolibre.com.hn', // Honduras
            'MLM': 'https://auth.mercadolibre.com.mx', // Mexico
            'MNI': 'https://auth.mercadolibre.com.ni', // Nicaragua
            'MPA': 'https://auth.mercadolibre.com.pa', // Panama
            'MPY': 'https://auth.mercadolibre.com.py', // Paraguay
            'MPE': 'https://auth.mercadolibre.com.pe', // Peru
            'MPT': 'https://auth.mercadolibre.com.pt', // Portugal
            'MLU': 'https://auth.mercadolibre.com.uy', // Uruguay
            'MLV': 'https://auth.mercadolibre.com.ve' // Venezuela
        };
    }

    get token_endpoint() {
        return '/oauth/token';
    }

    /**
     * @return Promise
     */
    get accessToken() {
        var self = this;
        var ac = self.manager.access_token;

        if (ac && !ac.is_valid) {
            return ac.refresh().then(function(ac) {
                self.manager.emit('token.refresh', ac);
                return Promise.resolve(ac);
            });
        }

        return Promise.resolve(ac);
    }

    static createAccessToken(manager, args) {
        var ac = new AccessToken(manager, args);
        ac.redirect_uri = null;
        ac.is_valid = true;

        return ac;
    }

    /**
     * @return Promise
     */
    exchangeAccessToken(code, redirect_uri) {
        var url = this.manager.endpoint;
        var self = this;

        url.pathname = this.token_endpoint;
        url.query['grant_type'] = 'authorization_code';
        url.query['client_id'] = this.manager.client_id;
        url.query['client_secret'] = this.manager.client_secret;
        url.query['code'] = code;
        url.query['redirect_uri'] = redirect_uri;

        return this.manager.post(url, null, AccessToken).then(function(result) {
            if (result.error) {
                result.is_valid = false;
                let err = new Error(result.message);
                err.error_code = result.error;
                err.cause = result.cause;
                err.code = result.status;
                throw err;
            }

            result.redirect_uri = redirect_uri;
            result.is_valid = true;

            self.manager.acess_token = result;

            return Promise.resolve(result);
        });
    }

    /**
     * AT=`curl -s -X POST -H 'content-type: application/x-www-form-urlencoded' \
     * 'https://api.mercadopago.com/oauth/token' -d 'grant_type=client_credentials' \
     * -d 'client_id=695869161068019' -d 'client_secret=AhJxvPDsCrWVyULWq5483k9nwury7uhY' \
     * | grep -o '"access_token":"[^"]*"' | sed -n 's/.*"access_token":"\(.*\)"/\1/p'`
     * curl -X POST \
     * -H "Content-Type: application/json" \
     * "https://api.mercadopago.com/users/test_user?access_token=$AT" \
     * -d '{"site_id":"MLB"}'
     * @return Promise
     */
    newAccessToken() {
        var url = this.manager.endpoint;
        var self = this;

        url.pathname = this.token_endpoint;
        url.query['grant_type'] = 'client_credentials';
        url.query['client_id'] = this.manager.client_id;
        url.query['client_secret'] = this.manager.client_secret;

        return this.manager.post(url, null, AccessToken).then(function(result) {
            if (result.error) {
                result.is_valid = false;
                let err = new Error(result.message);
                err.error_code = result.error;
                err.cause = result.cause;
                err.code = result.status;
                throw err;
            }

            result.redirect_uri = null;
            result.is_valid = true;

            self.manager.acess_token = result;

            return Promise.resolve(result);
        });
    }

    /**
     * @return Promise
     */
    refreshToken(refresh_token) {
        var self = this;
        var url = this.manager.endpoint;
        url.pathname = this.token_endpoint;
        url.query['grant_type'] = 'refresh_token';
        url.query['client_id'] = this.manager.client_id;
        url.query['client_secret'] = this.manager.client_secret;
        url.query['refresh_token'] = refresh_token;

        return this.manager.post(url, null, AccessToken).then(function(result) {
            if (result.error) { 
                result.is_valid = false;
                let err = new Error(result.message);
                err.error_code = result.error;
                err.cause = result.cause;
                err.code = result.status;
                return Promise.reject(err);
            }

            result.redirect_uri = null;
            result.is_valid = true;

            self.manager.access_token = result;

            return Promise.resolve(result);
        });
    }

    url(redirect_uri, site_id) {
        if (!site_id) {
            site_id = this.manager.defaultSite();
        }

        var url = URL.parse(this.auth_endpoint[site_id], true);

        url.pathname = '/authorization';
        url.query['client_id'] = this.manager.client_id;
        url.query['response_type'] = 'code';

        if (redirect_uri) {
            url.query['redirect_uri'] = redirect_uri;
        }

        return URL.format(url);
    }
}

exports = module.exports = Auth;
