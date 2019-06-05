var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JWTStrategy = passportJWT.Strategy;
const config = require("./database");
const User = require("../router/api/users.js");

module.exports = passport => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.secret
      },
      async (payload, done) => {
        try {
          const user = await User.getUserById(payload.id);
          if (!user) done(null, false);
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};
