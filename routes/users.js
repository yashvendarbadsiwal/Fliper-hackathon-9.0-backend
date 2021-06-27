const express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/user");
const passport = require("passport");
const router = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

router.use(bodyParser.json());
router
  .route("/")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyAdmin, (req, res, next) => {
    Users.find({}, { salt: 0, hash: 0 })
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

router
  .route("/login")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.cors, passport.authenticate("local"), (req, res) => {
    console.log(req.body);
    var token = authenticate.getToken({ _id: req.user._id });
    req.session.user = "authenticated";
    res.statusCode = 200;
    // res.cookie("token", token);
    res.setHeader("Content-Type", "application/json");

    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
      username: req.user.username,
      userid: req.user._id,
    });
  });

router
  .route("/signup")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.cors, (req, res, next) => {
    console.log(req.body);
    Users.register(
      new Users({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err != null) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
        } else {
          if (req.body.firstname) user.firstname = req.body.firstname;
          if (req.body.lastname) user.lastname = req.body.lastname;
          user.save().then((user) => {
            passport.authenticate("local")(
              req,
              res,
              () => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("You are sussesfully registered.");
              },
              (err) => {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.json({ err: err });
                return;
              }
            );
          });
        }
      }
    );
  });
router
  .route("/signup/google")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get(
    cors.cors,
    passport.authenticate("google_auth", {
      scope: "https://www.googleapis.com/auth/plus.login",
    }),
    (req, res, next) => {
      console.log(req);
      res.send("user created");
    }
  );

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("conFusion");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});
router
  .route("/signup1")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    console.log(req.cookies);
    res.json(req.cookies);
  });
module.exports = router;
