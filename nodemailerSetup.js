let nodemailer = require("nodemailer");

const mailOptions = {
  from: "yashvendars@gmail.com",
  to: "yashalwar4@gmail.com",
  subject: "Email from Node-App: A Test Message!",
  text: "Some content to send",
};
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mytempemail0411@gmail.com",
    pass: "yash11223344",
  },
});

module.exports.sendMail = function sendMail() {
  return new Promise((resolve, decline) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        decline(error);
      } else {
        resolve(info);
      }
    });
  });
};
