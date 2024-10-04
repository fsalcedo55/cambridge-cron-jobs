require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
})

const cron = require("node-cron")
const ReminderJob = require("./jobs/reminderJob")

const reminderJob = new ReminderJob()

console.log("Loading environment variables...")
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL)
console.log(
  "GOOGLE_PRIVATE_KEY:",
  process.env.GOOGLE_PRIVATE_KEY
    ? "Set (length: " + process.env.GOOGLE_PRIVATE_KEY.length + ")"
    : "Not set"
)

// Schedule the reminder job to run every 15 minutes
cron.schedule("* * * * *", async () => {
  console.log("Running reminder job...")
  await reminderJob.run()
})

// Schedule the clearing job to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Clearing reminders...")
  reminderJob.clearReminders()
})

console.log(
  "Reminder service started. Checking calendars every 15 minutes and clearing reminders daily at midnight."
)

console.log("Application starting...")
console.log("Node environment:", process.env.NODE_ENV)

console.log(
  "GOOGLE_CLIENT_EMAIL:",
  process.env.GOOGLE_CLIENT_EMAIL ? "Set" : "Not set"
)
console.log(
  "GOOGLE_PRIVATE_KEY:",
  process.env.GOOGLE_PRIVATE_KEY ? "Set" : "Not set"
)
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set")
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not set")
console.log("All environment variables:", Object.keys(process.env))
