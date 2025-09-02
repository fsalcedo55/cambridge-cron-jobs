const dotenv = require("dotenv")
const NODE_ENV = process.env.NODE_ENV || "development"

dotenv.config()

const config = {
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  teacherEmails: [
    ...(NODE_ENV === "development"
      ? [process.env.TEACHER_EMAIL_4]
      : [
          process.env.TEACHER_EMAIL_1,
          process.env.TEACHER_EMAIL_2,
          process.env.TEACHER_EMAIL_3,
          process.env.TEACHER_EMAIL_5,
        ]),
  ].filter(Boolean),
  calendars: [
    "primary",
    ...(NODE_ENV === "development"
      ? [process.env.TEACHER_EMAIL_4]
      : [
          process.env.TEACHER_EMAIL_1,
          process.env.TEACHER_EMAIL_2,
          process.env.TEACHER_EMAIL_3,
          process.env.TEACHER_EMAIL_5,
        ]),
  ].filter(Boolean),
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
  isDevelopment: NODE_ENV === "development",
  isProduction: NODE_ENV === "production",
}

console.log("Loaded config:", JSON.stringify(config, null, 2))

module.exports = config
