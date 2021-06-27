var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var MongoClient = require("mongodb").MongoClient;
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mailRouter = require("./routes/Mails");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const config = require("./config");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const dburl =
  "mongodb+srv://m001-student:yashvendar@sandbox.sqipi.mongodb.net/fliprHackathon?retryWrites=true&w=majority";
const connect = mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connect
  .then((db) => {
    console.log("Connected to server");
  })
  .catch((err) => console.log("Error occor in connecting to server"));

app.use(passport.initialize());
app.use(bodyParser.json());

// app.all("*", (req, res, next) => {
//   if (req.secure) {
//     return next();
//   } else {
//     res.redirect(
//       307,
//       "https://" + req.hostname + ":" + app.get("secPort") + req.url
//     );
//   }
// });

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/mail", mailRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
