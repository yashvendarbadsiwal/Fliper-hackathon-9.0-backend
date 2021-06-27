let nodemailer = require("nodemailer");
const Mails = require("./models/Mail");
const schedule = require("node-schedule");
const mailOptions = {
  from: "yashvendars@gmail.com",
  to: "yashalwar4@gmail.com",
  subject: "Email from Node-App: A Test Message!",
  text: "Some content to send",
};
const getMailOptions = (mail) => {
  let mailOptions = {};
  mailOptions.to = mail.to;
  mailOptions.from = mail.from;
  if (mail.cc !== "") mailOptions.cc = mail.cc;
  if (mail.bcc !== "") mailOptions.bcc = mail.bcc;
  mailOptions.subject = mail.subject;
  if (mail.isText) {
    mailOptions.text = mail.text;
  } else {
    mailOptions.html = mail.html;
  }
  return mailOptions;
};
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mytempemail0411@gmail.com",
    pass: "yash11223344",
  },
});

module.exports.sendMail = function sendMail(mail) {
  return new Promise(async (resolve, decline) => {
    transporter.sendMail(getMailOptions(mail), function (error, info) {
      if (error) {
        console.log(error);
        decline(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports.getNodeScheduleRule = (mail) => {
  const rule = new schedule.RecurrenceRule();
  if (mail.hour !== "*") {
    rule.hour = mail.hour;
  }
  if (mail.second !== "*") rule.second = mail.second;
  if (mail.date !== "*") rule.date = mail.data;
  if (mail.dayOfWeek !== "*") rule.dayOfWeek = mail.dayOfWeek;
  if (mail.month !== "*") rule.month = mail.month;
  if (mail.year !== "*") rule.year = mail.year;
  if (mail.minute !== "*") rule.minute = mail.minute;
  return rule;
};
