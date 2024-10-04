const dotenv = require("dotenv")
const config = require("./config")

dotenv.config()

export const teacherEmails = [
  process.env.TEACHER_EMAIL_1,
  process.env.TEACHER_EMAIL_2,
  process.env.TEACHER_EMAIL_3,
  process.env.TEACHER_EMAIL_4,
].filter(Boolean)

console.log("Config loaded:")
console.log("Email user:", config.email.user ? "Set" : "Not set")
console.log("Email pass:", config.email.pass ? "Set" : "Not set")
console.log(
  "Google client email:",
  config.google.clientEmail ? "Set" : "Not set"
)
console.log("Google private key:", config.google.privateKey ? "Set" : "Not set")

module.exports = {
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  teacherEmails,
  calendars: ["primary", ...teacherEmails],
  reminderWindow: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  google: {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  },
}
