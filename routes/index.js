var express = require("express");
const { sendMail } = require("../nodemailerSetup");
var schedule = require("node-schedule");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router
  .get("/mail", async (req, res, next) => {
    sendMail().then(
      (e) => res.send("Mail sent"),
      (err) => res.send("Error occure")
    );
  })
  .get("/addcronjob", (req, res, next) => {})
  .get("/nodecron", (req, res, next) => {
    // console.log(CronJob);
    schedule.scheduleJob("helloyash", "* * * * *", (d, e) => {
      console.log(d, e);
    });

    setTimeout(() => {
      let current_job = schedule.scheduledJobs["helloyash"];
      current_job.cancel();
    }, 180000);
  });

module.exports = router;
