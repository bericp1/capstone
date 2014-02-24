## Not a Sock Drawer v0.2.1
#### A less-than-typical but logically structured angular+expressjs web app skeleton

Inspired by [this pretty cool article](http://cliffmeyers.com/blog/2013/4/21/code-organization-angularjs-javascript)
by [this pretty cool dev](https://twitter.com/cliffmeyers).

### Getting Started

In an existing git project (right after `git init`):

 1. `git remote add skeleton https://github.com/bericp1/skeleton`
 2. `git pull skeleton master`
  * Change `master` to `master:dev` if you want to develop on a `dev` branch
 3. `npm install`
 4. `grunt setup`

### Structure

 * `/lib/`:     first-party node modules
 * `/models/`:  mongoose models; see [README](models/ "models/")
 * `/public/`:  front end; see [README](public/ "public/")
 * `/routes/`:  express routes; see [README](routes/ "routes/")
 * `/tasks/`:   grunt tasks

### Deploying to Heroku

This app seed now uses [heroku-buildpack-nodejs-grunt](https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt) so
the entire dev version of the app is pushed to heroku and this custom build pack will run the appropriate build tasks.
This eliminates the need to commit production changes and then roll them back after deployment; however, *All deps
necessary to building must be registered in `package.json` under `dependencies` not `devDependencies`*!

### Environment Variables

If the file `.env` exists in the project's root directory, it will be parsed and added to node's `process.env`. The
file should be formatted where each line looks like `VAR_NAME=VAR_VALUE`.

### Change Bootswatch Theme

In the project directory:

    $ grunt shell:theme        # Lists available themes
    $ grunt shell:theme:list   # ^^
    $ grunt shell:theme:cosmo  # Changes theme to cosmo


### Testing

Yet to be implemented :-(

### TODO

 * TESTING!!!!!!11!11!!1!
 * Better explain what happens in the dev/build/deploy cycle (for now, check [me](./Gruntfile.js "the Gruntfile") out)
 * ~~Implement LESS~~
 * ~~Implement require.js for angular modules for easier module loading~~ **(Used browserify)**
 * ~~Implement usemin, concat, and uglify~~
 * ~~Implement cache busting of all assets referenced in all files (templates, css files, etc.)~~
 * Improve heroku-specific setup process to account for errors, pipe std* instead of buffering to a string, and more
 * Eventually turn this into a yeoman buildpack thing or a standalone tool altogether
 * Improve rename setup process so that it doesn't rely on simple find/replace and and actually knows where to change the app name
 * Make these TODO items actual bugs on github -_-
 * Pure modularity wherein each part of the application has it's own bundled Mongoose models, Angular parts, libs, express
   routes, etc. Currently, application parts have only dedicated front-end modules (angular parts).
 * Lots more...

### Change log

 - **v0.1.0**
  - Started change log (:
  - Added mongoose support
  - Added a lot of helper functions/utilities to make working with mongoose even easier
  - Added auto-registering of mongoose models
  - Added optional auto-loading of a CRUD-like interface for mongoose models' documents
  - Added ability to quickly change bootswatch theme with grunt command
  - Env variables are automatically loaded from .env before the server starts in dev mode
  - Files in `lib/`, `models/`, and `routes/` are now watched for changes during `grunt dev`
  - Renamed `common` to `assets`
  - Preparing to implement browserify
  - Next mini-update will patch up the example to use mongoose for demonstration purposes
 - **v0.2.0**
  - Made `lib/auto-db` less stingy about trailing slashes in paths
  - Updated example to use mongoose (though now there aren't any examples of custom routes)
  - Clarified some of the model README
  - All client side modularity is now handled by browserify. See [README](public/)
  - All stylesheet loading is now done directly through LESS `@import`s
  - `less-prefixer` fixed and in-use
  - New bootswatch theme (*yeti*)
  - Removed all minified third party sources (minifcation is done by build process here
  - Socket.io is fully in working condition and adjusted to Heroku.
   - This includes the angular module `angular-socket-io` which has been configured to forward all socket events to the
     root scope with a prefix `'socket.'` for all events
  - `index.html` cleaned up
 - **v0.2.1**
  - README fixes
  - Organizational Fixes
  - Fixes to example/main.tmpl layout