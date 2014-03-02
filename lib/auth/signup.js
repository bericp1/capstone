var mongoose      = require('mongoose'),
  authenticate    = require('./authenticate'),
  errors          = require('./errors'),
  User            = mongoose.model('User');

module.exports = function(req, res, next){
  var missing = [];
  var required = ['email', 'password', 'name'];
  required.forEach(function(field){
    if(
      !req.body.hasOwnProperty(field)
      || typeof req.body[field] === "undefined"
      || (typeof req.body[field] === 'string' && req.body[field].trim() === '')
      ){
      missing.push(field);
    }
  });
  if(missing.length > 0){
    res.send(400, {error: errors.missingFields, fields: missing});
  }else{
    User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
      if (err)
        return next(err);

      if (user) {
        return res.send(401, {error:errors.email.exists, fields:['email']});
      } else {

        var newUser            = new User();
        newUser.local.email    = req.body.email;
        newUser.local.password = User.generateHash(req.body.password);
        newUser.local.name     = req.body.name;

        return newUser.save(function(err) {
          if(err) return next(err);
          else{
            return authenticate('login')(req, res, next);
          }
        });
      }
    });
  }
};