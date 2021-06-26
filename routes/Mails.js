var express = require("express");
const { sendMail, getNodeScheduleRule } = require("../nodemailerSetup");
var schedule = require("node-schedule");
const Mails = require("../models/Mail");
var router = express.Router();

router.get("/createjob", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (!req.body.isSchedule) {
    sendMail(req.body).then(
      (mail) => {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(mail);
      },
      (err) => next(err)
    );
  } else {
    Mails.create(req.body).then((mail) => {
      console.log(mail);
      schedule.scheduleJob(
        "helloyash",
        getNodeScheduleRule(mail.schedule),
        () => {
          sendMail(mail);
        }
      );
    });
    setTimeout(() => {
      let current_job = schedule.scheduledJobs["helloyash"];
      current_job.cancel();
      res.send("setTimeOut is done.");
    }, 80000);
  }
});
module.exports = router;
