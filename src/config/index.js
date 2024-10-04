const dotenv = require("dotenv")
// const config = require("./config")

dotenv.config()

const config = {
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  teacherEmails: [
    // process.env.TEACHER_EMAIL_1,
    // process.env.TEACHER_EMAIL_2,
    // process.env.TEACHER_EMAIL_3,
    process.env.TEACHER_EMAIL_4,
  ].filter(Boolean),
  calendars: [
    "primary",
    // process.env.TEACHER_EMAIL_1,
    // process.env.TEACHER_EMAIL_2,
    // process.env.TEACHER_EMAIL_3,
    process.env.TEACHER_EMAIL_4,
  ],
  reminderWindow: 7200000, // 2 hours in milliseconds
  google: {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  },
}

module.exports = config
