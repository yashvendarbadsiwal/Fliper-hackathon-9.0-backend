var express = require("express");
const { sendMail, getNodeScheduleRule } = require("../nodemailerSetup");
var schedule = require("node-schedule");
const CronJobManager = require("cron-job-manager");
const Mails = require("../models/Mail");
var router = express.Router();
var authenticate = require("../authenticate");
const cors = require("./cors");
router
  .route("/")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user._id.toString());
    Mails.find({ userid: req.user._id.toString() }).then(
      (mails) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(mails);
      },
      (err) => next(err)
    );
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    if (!req.body.isSchedule) {
      Mails.create(req.body).then(
        (mail) => {
          console.log(mail);
          sendMail(req.body).then(
            (mail_details) => {
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.json(mail);
            },
            (err) => next(err)
          );
        },
        (err) => next(err)
      );
    } else {
      Mails.create(req.body).then(
        (mail) => {
          console.log(mail);
          schedule.scheduleJob(
            mail._id.toString(),
            getNodeScheduleRule(mail.schedule),
            () => {
              sendMail(mail);
            }
          );
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(mail);
        },
        (err) => next(err)
      );
    }
  })
  .put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Mails.findByIdAndUpdate(req.body._id, {
      $set: req.body,
    }).then(
      (mail) => {
        let current_job = schedule.scheduledJobs[req.body._id.toString()];
        if (current_job) current_job.cancel();
        if (mail.isSchedule) {
          schedule.scheduleJob(
            mail._id.toString(),
            getNodeScheduleRule(mail.schedule),
            () => {
              sendMail(mail);
            }
          );
        }
        res.statusCode = 204;
        res.setHeader("Content-Type", "application/json");
        res.json(mail);
      },
      (err) => next(err)
    );
  })
  .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Mails.deleteOne({ _id: req.body._id, userid: req.body.userid }).then(
      (mail) => {
        let current_job = schedule.scheduledJobs[req.body._id.toString()];
        if (current_job) current_job.cancel();

        res.setHeader("Content-Type", "application/json");
        res.json(mail);
      },
      (err) => next(err)
    );
  });
module.exports = router;
