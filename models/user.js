var Schema = require('mongoose').Schema,
  bcrypt   = require('bcrypt-nodejs');
module.exports = {
  name: 'User',
  schema: {
    name:   {
      type: String,
      validate: [function(name){
        return name.trim().toLowerCase() !== '';
      }, 'Name can\'t be empty.']
    },
    games: [{
      type: Schema.Types.ObjectId,
      ref: 'GameSave',
      'default': []
    }],

    local: {
      email        : String,
      password     : String
    },
    facebook: {
      id           : String,
      token        : String,
      email        : String,
      name         : String
    },
    twitter: {
      id           : String,
      token        : String,
      displayName  : String,
      username     : String
    },
    google: {
      id           : String,
      token        : String,
      email        : String,
      name         : String
    }
  },
  statics: {
    generateHash: function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
  },
  methods: {
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.local.password);
    }
  }
};