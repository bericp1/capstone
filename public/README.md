## The `public` Directory

####The `public` directory hosts the client-side angular app.

Every subdirectory is it's own related sets of models, services, directives, controllers, etc. and must include
a manifest-like file (most likely `index.js` for easier `require()`ing) which creates an angular module
out of all the individual components. See the [`examples/`](examples/) subdirectory.

Browserify us used throughout the client side. See the [`examples/`](examples/) subdirectory for usage.

Special files/folders

 - `assets/`:
  * first-party assets used throughout the client side
 - `vendor/`:
  * third-party assets used throughout the client side
 - `common/`:
  * Angular components that are useful for all modules and particular to this skeleton/seed
 - `app.js`:
  * a manifest-like file where the angular app is instantiated and modules from individual folders are `require()`ed
 - `vendor.js`:
  * Any third party libraries are included into the project here. **Any third-party libraries that don't automatically
    attach to `window` (like jQuery) must be `shim`d in Gruntfile.js**
 - `app.less`:
  * a manifest-like file where individual stylesheets are `@import`ed from the modules
 - `vendor.less`:
  * Any third-party stylesheets should be `@import`ed here. Be sure to use LESS's `@import (less) 'path'` when importing
    a css stylesheet so that it's concatenated when build and not just left as an @import statement.
 - `index.html`:
  * Base index for app. Here, all 4 of the previously mentioned files are pulled in so there isn't much that will ever
    need to be edited in this file except `<meta>` tags, `<title>`, etc.