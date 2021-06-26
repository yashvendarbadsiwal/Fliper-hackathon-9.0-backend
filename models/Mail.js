const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Schedule = new Schema({
  date: {
    type: String,
    default: "*",
  },
  dayOfWeek: {
    type: String,
    default: "*",
  },
  month: {
    type: String,
    default: "*",
  },
  year: {
    type: String,
    default: "*",
  },
  houre: {
    type: String,
    default: "*",
  },
  second: {
    type: String,
    default: "*",
  },
  minute: {
    type: String,
    default: "*",
  },
  tz: {
    type: String,
    default: "IST",
  },
});
const mailSchema = new Schema({
  subject: {
    type: String,
    default: "",
    require: true,
  },
  to: {
    type: String,
    require: true,
  },
  from: {
    type: String,
    require: true,
  },
  cc: {
    type: String,
    default: "",
  },
  bcc: {
    type: String,
    default: "",
  },
  isText: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: "",
  },
  html: {
    type: String,
    default: "",
  },
  isSchedule: {
    type: Boolean,
    default: false,
  },
  schedule: {
    date: {
      type: String,
      default: "*",
    },
    dayOfWeek: {
      type: String,
      default: "*",
    },
    month: {
      type: String,
      default: "*",
    },
    year: {
      type: String,
      default: "*",
    },
    hour: {
      type: String,
      default: "*",
    },
    second: {
      type: String,
      default: "*",
    },
    minute: {
      type: String,
      default: "*",
    },
    // tz: {
    //   type: String,
    //   default: "IST",
    // },
  },
});
const Mails = mongoose.model("Mails", mailSchema);
module.exports = Mails;
