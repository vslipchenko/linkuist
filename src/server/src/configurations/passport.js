const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models/user');
const bcrypt = require('bcrypt');

const passportConfigurationInit = () => {
  /* Strategies */
  // Local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    User.findOne({email}, (err,user) => {
      return err
        ? done(err)
        : user
          ? bcrypt.compareSync(password, user.password)
            ? done(null, user)
            : done(null, false, { message: 'Incorrect password' })
          : done(null, false, { message: 'Invalid email' });
    });
  }));
}

module.exports = passportConfigurationInit;
