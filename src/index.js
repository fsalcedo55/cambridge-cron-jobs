require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
})

const cron = require("node-cron")
const ReminderJob = require("./jobs/reminderJob")
const express = require("express")
const authRoutes = require("./routes/auth")

const app = express()

app.use(authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log("Application starting...")

const reminderJob = new ReminderJob()

// Schedule the 2-hour reminder job to run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Cron job triggered: Running 2-hour reminder job...")
  try {
    await reminderJob.run()
    console.log("2-hour reminder job completed successfully")
  } catch (error) {
    console.error("Error in 2-hour reminder job cron:", error)
  }
})

// Schedule the 10-hour reminder job to run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Cron job triggered: Running 10-hour reminder job...")
  try {
    await reminderJob.runTenHourReminder()
    console.log("10-hour reminder job completed successfully")
  } catch (error) {
    console.error("Error in 10-hour reminder job cron:", error)
  }
})

// Schedule the clearing job to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Clearing reminders...")
  reminderJob.clearReminders()
})

console.log("Cron jobs set up. Waiting for scheduled execution...")
