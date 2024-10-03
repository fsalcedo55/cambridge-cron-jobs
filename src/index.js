require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
})

const cron = require("node-cron")
const ReminderJob = require("./jobs/reminderJob")

const reminderJob = new ReminderJob()

// Schedule the reminder job to run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
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
