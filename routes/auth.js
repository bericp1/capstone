var express = require('express'),
  authenticate = require('../lib/auth/authenticate'),
  signup = require('../lib/auth/signup'),
  logout = require('../lib/auth/logout'),
  app = express();

app.post('/signup',
  signup,
  function(req,res){
    delete req.user.password;
    res.send({
      status: 'ok',
      token: req.user.local.token.value,
      user: req.user
    });
  }
);

app.post('/login',
  authenticate('login'),
  function(req,res){
    delete req.user.password;
    res.send({
      status: 'ok',
      token: req.user.local.token.value,
      user: req.user
    });
  }
);

app.post('/logout',
  authenticate(),
  logout,
  function(req,res){
    res.send({
      status: 'ok'
    });
  }
);

module.exports = app;