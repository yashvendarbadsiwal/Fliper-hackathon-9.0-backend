const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mailSchema = new Schema({
  userid: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    default: "",
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
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
