const dotenv = require("dotenv")

dotenv.config()

export const teacherEmails = [
  process.env.TEACHER_EMAIL_1,
  process.env.TEACHER_EMAIL_2,
  process.env.TEACHER_EMAIL_3,
  process.env.TEACHER_EMAIL_4,
]

module.exports = {
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  teacherEmails,
  calendars: ["primary", teacherEmails],
  reminderWindow: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
}
