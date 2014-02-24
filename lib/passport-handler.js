var  passport = require('passport');

module.exports = function(strategy){
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, info) {
      res.type('json');
      if (err) { return next(err) }
      if(!user){
        res.status(401);
        return res.send({
          'status': 'error',
          'error': info.error || info.message || 'Unauthorized'
        });
      }else{
        req.user = user;
        return next();
      }
    })(req, res, next);
  };
};