## MercadoLibre API

### Installation

> npm install --save mercadolibre-nodejs

### Usage

```js
const Meli = require('mercadolibre-nodejs');
var meli = new Meli('client_id', 'client_secret'[, 'access_token'][, 'refresh_token']);
```

### Enable new response format

```js
meli.setUseNewFormat(true)
```

### API

With Meli instantiated:

#### meli.defaultSite([site_id])

If site_id is provided, it sets the defaultSite to be used. If not provided, it
will fallback to MLB;

#### meli.site([site_id])

If site_id is provided, it will return an Promise that will resolve to a Site
model.
If not provided, it will return an Promise that has all sites available
(each site as a Site model).

#### meli.categories(site_id)

It will return an Promise that has all site_id categories (each category as a
Category model).

#### meli.item([item_id])

Returns an resource that handles `Listing`.

If item_id is provided it will return an Promise that will resolve to an Item
model.

#### meli.order([order_id])

Returns an resource that handles `Orders`.

If item_id is provided it will return an Promise that will resolve to an Order
model.

#### meli.collection([collection_id])

Returns an resource that handles `Collections`.

If item_id is provided it will return an Promise that will resolve to an Collection
model.

#### meli.auth

Returns an object that handles `Authentication and Authorization`

##### meli.auth.auth_endpoint

List of all authentication endpoints supported.

##### meli.auth.url

Returns the authentication url

##### meli.auth.accessToken

Returns an promise that resolves to the active accessToken. It handles refreshing
if accessToken is marked an invalid. (i.e is_valid);

##### meli.auth.newAccessToken(code, redirect_uri)

Returns an Promise that will handle the generation of an AccessToken based on
login code.

##### meli.auth.refreshToken(refresh_token)

Returns an Promise that handle the generation of a new AccessToken based on a
refresh_token. The result of the promise is an AccessToken model.

### TODO

1. Tests.. tests.. tests.. TESTS!!!!11
2. Handle adding, updating, deleting of Items;
3. Handle order cancellation and updating;
4. Handle shippings;
5. Anything else we need ;)
