var Schema = require('mongoose').Schema,
  bcrypt   = require('bcrypt-nodejs'),
  crypto   = require('crypto'),
  authConf = require('../config/auth'),
  errors   = require('../lib/auth/errors');

module.exports = {
  name: 'User',
  schema: {
    games: [{
      type: Schema.Types.ObjectId,
      ref: 'GameSave',
      'default': []
    }],

    local: {
      email: {
        type:       String,
        required:   errors.generic.required
      },
      password: {
        type:       String,
        required:   errors.generic.required
      },
      token: {
        value:      String,
        expires:    Number
      },
      name:   {
        type:       String,
        required:   errors.generic.required,
        validate:   [function(name){ return name && name.trim().toLowerCase() !== ''; }, errors.name.empty]
      }
    },
    facebook: {
      id:           String,
      token:        String,
      email:        String,
      name:         String
    },
    twitter: {
      id:           String,
      token:        String,
      displayName:  String,
      username:     String
    },
    google: {
      id:           String,
      token:        String,
      email:        String,
      name:         String
    }
  },
  statics: {
    generateHash: function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    generateToken: function(done){
      crypto.randomBytes(authConf.tokenBytes, function(err, buf) {
        if(err) return done(err);
        else    return done(null, buf.toString('hex'));
      });
    }
  },
  methods: {
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.local.password);
    },
    validToken: function(){
      return Date.now() < this.local.token.expires;
    }
  }
};