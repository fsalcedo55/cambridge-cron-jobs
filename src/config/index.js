const dotenv = require("dotenv")
// const config = require("./config")

dotenv.config()

console.log("Dotenv config loaded")
console.log("Environment variables:")
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set")
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not set")
console.log(
  "GOOGLE_CLIENT_EMAIL:",
  process.env.GOOGLE_CLIENT_EMAIL ? "Set" : "Not set"
)
console.log(
  "GOOGLE_PRIVATE_KEY:",
  process.env.GOOGLE_PRIVATE_KEY ? "Set" : "Not set"
)

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

console.log("Config loaded:", JSON.stringify(config, null, 2))

module.exports = config
