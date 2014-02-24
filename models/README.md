## The `models` directory

#### Mongoose model definitions go here

Files in this directory are expected to be simple node modules that export an object that describes the model (see
below). Models in this directory are automatically registered with mongoose on server start.

##`exports.name`
###Type: `string`

The model's name as it should be registered in Mongoose with

##`exports.schema`
###Type: `object`

An object that will be registered with Mongoose as the model's schema. See
[mongoose's docs](http://mongoosejs.com/docs/models.html).

**Also note that any document properties that start with an `_` are considered non-required by all server side logic**,
meaning documents can be created without defining this specific property.

##`exports.autoLoad` (optional)
###Type: `object`|`boolean`

If it's an object, a CRUD-like interface will be made available on the server path `/data/[lowercase, hyphenated model name]`
that responds to various paths/methods using certain handlers defined on `DBActions`. The object's properties must be one
of these handlers (e.g. `getOne`, `update`, etc.) and each value must be either an object with properties:

 - `path`: The path that the handler will respond to
 - `method`: The valid HTTP method that the handler will respond to
 - `admin`: If auth is required to perform this action

or simply a boolean. If this is the case, the defaults for `autoLoad === true` are used with each `admin` property overridden
with the given boolean value.

If `autoLoad === true`, it's synonymous to:

    {
      'getAll': {
        path: '',
        method: 'get',
        admin: false
      },
      'getOne': {
        path: '/:id',
        method: 'get',
        admin: false
      },
      'update': {
        path: '',
        method: 'post',
        admin: true
      },
      'delete': {
        path: '/:id',
        method: 'delete',
        admin: true
      }
    }

If `autoLoad` is anything else, an interface for the model's documents will not be automatically created.