var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var Users = require("./models/user");
var JwtStrategy = require("passport-jwt").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");
var config = require("./config");

exports.local = passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 360000 });
};
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log("JWT payload", jwt_payload);
    Users.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });

passport.use(
  "admin",
  new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log('JWT payload',jwt_payload);
    Users.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user && user.admin == true) {
        return done(null, user);
      } else {
        err = new Error("You don't have permission for this operation");
        err.status = 403;
        return done(err, false);
      }
    });
  })
);

exports.verifyAdmin = passport.authenticate("admin", { session: false });
passport.use(
  "google_auth",
  new GoogleStrategy(
    {
      clientID:
        "193577459583-r55oh4o0b4k1umbrc327k3k7sk2eammr.apps.googleusercontent.com",
      clientSecret: "Vbk4iHSiOtcuxWAAD4gNlwOl",
      callbackURL: "http://localhost:3000/",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
exports.googleVerify = passport.authenticate("google_auth", {
  session: false,
});
