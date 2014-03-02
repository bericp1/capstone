var express = require('express'),
  passportHandler = require('../lib/auth/authenticate'),
  signup = require('../lib/auth/signup'),
  app = express();

app.post('/signup',
  signup,
  function(req,res){
    res.send({
      status: 'ok',
      token: req.user.local.token.value
    });
  }
);

app.post('/login',
  passportHandler('login'),
  function(req,res){
    res.send({
      status: 'ok',
      token: req.user.local.token.value
    });
  }
);

app.get('/check',
  passportHandler(),
  function(req, res){
    delete req.user.local.password;
    res.send({
      status: 'ok',
      user: req.user
    });
  }
);

module.exports = app;