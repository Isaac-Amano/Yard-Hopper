const expressSession = require('express-session');
const PgSession = require('connect-pg-simple')(expressSession);
const pool = require('./pool.js');
const warnings = require('../constants/warnings');

const serverSessionSecret = () => {
  if (
    !process.env.SERVER_SESSION_SECRET ||
    process.env.SERVER_SESSION_SECRET.length < 8 ||
    process.env.SERVER_SESSION_SECRET === warnings.exampleBadSecret
  ) {
    
    console.log(warnings.badSecret);
  }

  return process.env.SERVER_SESSION_SECRET;
};

let pruneSessionInterval = 60;
if (process.env.NODE_ENV === 'test') {
    pruneSessionInterval = false;
}
module.exports = expressSession({
    store: new PgSession({
        pool,
        createTableIfMissing: true,
        pruneSessionInterval,
    }),
    secret: serverSessionSecret() || 'secret', 
    name: 'user', 
    saveUninitialized: false,
    resave: false,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, 
      httpOnly: true, 
      secure: false 
    },
});
