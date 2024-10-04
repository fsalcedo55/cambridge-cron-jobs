require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
})

const cron = require("node-cron")
const ReminderJob = require("./jobs/reminderJob")

console.log("Application starting...")

const reminderJob = new ReminderJob()

// Schedule the reminder job to run every 15 minutes
cron.schedule("* * * * *", async () => {
  console.log("Cron job triggered: Running reminder job...")
  try {
    await reminderJob.run()
    console.log("Reminder job completed successfully")
  } catch (error) {
    console.error("Error in reminder job cron:", error)
  }
})

// Schedule the clearing job to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Clearing reminders...")
  reminderJob.clearReminders()
})

console.log("Cron jobs set up. Waiting for scheduled execution...")
