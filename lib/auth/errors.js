module.exports = {
  generic: {
    required: '{PATH} is required.'
  },
  name: {
    empty:            'Name can\'t be empty.'
  },
  email: {
    bad:              'A user with that email doesn\'t exist.',
    exists:           'Email already taken.'
  },
  password: {
    bad:              'Incorrect password.'
  },
  token: {
    invalid:          'Invalid token.',
    expired:          'Expired token.'
  },
  missingFields:      'Missing one or more required fields.',
  emailAndPassword:   'You need an email and a password to login.',
  unauthorized:       'Unauthorized',
  database:           'Server error with database. Try again later.'
};