## The `routes` Directory

####The `routes` directory hosts the express routes (go figure).

There is no need to individually call `app.use` on each route inside `app.js`; the [`rroute`](../lib/rroute.js) module
loads all of the routes in this directory in way that the path to reach each route is the same as the path to the
route's source from the `routes` directory.

Zum Beispiel...

 * The logic described in `/routes/example.js` is invoked on the request for `/example/*`
 * The logic described in `/routes/example/index.js` is invoked on the request for `/example/*`
 * The logic described in `/routes/example/cats.js` is invoked on the request for `/example/cats/*`