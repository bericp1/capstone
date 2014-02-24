var mongoose      = require('mongoose'),
  LocalStrategy   = require('passport-local').Strategy,
  User       		  = mongoose.model('User');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password'
    },
    function(email, password, done) {
      User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err)
          return done(err);

        if (user) {
          return done(null, false, {error:'Email already taken.'});
        } else {

          var newUser            = new User();
          newUser.local.email    = email;
          newUser.local.password = User.generateHash(password);

          return newUser.save(function(err) {
            if(err) return done(err);
            return done(null, newUser);
          });
        }
      });
    }
  ));


  passport.use('local-login', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password'
    },
    function(email, password, done) {
      User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err)
          return done(err);

        console.log('email:', email, 'user:', user);

        if (!user)
          return done(null, false, {error:'A user with that email doesn\'t exist.'});

        if (!user.validPassword(password))
          return done(null, false, {error:'Incorrect password.'});

        return done(null, user);
      });
    }
  ));

};