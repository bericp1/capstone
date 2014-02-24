var express = require('express'),
  passportHandler = require('../lib/passport-handler'),
  app = express();

app.post('/signup',
  passportHandler('local-signup'),
  function(req,res){
    res.type('json');
    res.send({
      status: 'ok',
      user: req.user
    });
  }
);

app.post('/login',
  passportHandler('local-login'),
  function(req,res){
    res.type('json');
    res.send({
      status: 'ok',
      user: req.user
    });
  }
);

module.exports = app;