const dotenv = require("dotenv")

dotenv.config()

const config = {
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  teacherEmails: [
    process.env.TEACHER_EMAIL_1,
    process.env.TEACHER_EMAIL_2,
    process.env.TEACHER_EMAIL_3,
    process.env.TEACHER_EMAIL_4,
  ].filter(Boolean),
  calendars: [
    "primary",
    process.env.TEACHER_EMAIL_1,
    process.env.TEACHER_EMAIL_2,
    process.env.TEACHER_EMAIL_3,
    process.env.TEACHER_EMAIL_4,
  ],
  reminderWindow: 7200000, // 2 hours in milliseconds
  tenHourReminderWindow: 36000000, // 10 hours in milliseconds
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3000/auth/google/callback",
    accessToken: process.env.GOOGLE_ACCESS_TOKEN,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
}

console.log("Loaded config:", JSON.stringify(config, null, 2))

module.exports = config
