const { authorize, getUpcomingEvents } = require("../services/googleCalendar")
const EmailService = require("../services/emailService")
const config = require("../config/index")

class ReminderJob {
  constructor() {
    console.log("Initializing ReminderJob...")
    this.remindersSent = new Map()
    this.emailService = new EmailService(config.email)
  }

  async run() {
    console.log("ReminderJob.run() started")
    try {
      console.log("Running reminder job class...")
      const auth = await authorize()
      console.log("Google Calendar authorization successful")

      const now = new Date()
      const twoHoursFromNow = new Date(now.getTime() + config.reminderWindow)
      console.log(
        `Checking for events between ${now.toISOString()} and ${twoHoursFromNow.toISOString()}`
      )

      for (let calendarId of config.calendars) {
        console.log(`Processing calendar: ${calendarId}`)
        try {
          const events = await getUpcomingEvents(
            auth,
            calendarId,
            now,
            twoHoursFromNow
          )
          console.log(
            `Found ${events.length} events for calendar ${calendarId}`
          )

          for (let event of events) {
            console.log(`Processing event: ${event.summary} (ID: ${event.id})`)
            await this.sendReminderForEvent(event)
          }
        } catch (error) {
          console.error(`Error processing calendar ${calendarId}:`, error)
        }
      }

      console.log("ReminderJob.run() completed successfully")
    } catch (error) {
      console.error("Error in reminder job:", error)
    }
  }

  async sendReminderForEvent(event) {
    console.log(`Sending reminder for event: ${event.summary}`)
    // Add logging here
    console.log(`Sending reminder for event: ${event.summary}`)
    if (event.summary && event.summary.toLowerCase().includes("cancel")) {
      console.log(`Skipping reminder for cancelled event: ${event.summary}`)
      return
    }

    function getFirstTwoWords(str) {
      const words = str.split(" ")
      return words.slice(0, 2).join(" ")
    }

    function getFirstWord(str) {
      return str.split(" ")[0]
    }

    function getTeacherName(str) {
      switch (str) {
        case process.env.TEACHER_EMAIL_1:
          return process.env.TEACHER_NAME_1
        case process.env.TEACHER_EMAIL_2:
          return process.env.TEACHER_NAME_2
        case process.env.TEACHER_EMAIL_3:
          return process.env.TEACHER_NAME_3
        case process.env.TEACHER_EMAIL_4:
          return process.env.TEACHER_NAME_4
        default:
          return "TBA"
      }
    }

    const startDate = new Date(event.start.dateTime)
    const endDate = new Date(event.end.dateTime)
    const durationInMinutes = (endDate - startDate) / (1000 * 60)

    const eventId = event.id
    const eventDateTime = event.start.dateTime
    const eventDuration = durationInMinutes
    const eventLocation = event.location
    const organizerEmail = event.organizer.email
    const teacherName = getTeacherName(event.organizer.email)
    const studentName = getFirstTwoWords(event.summary)
    const studentFirstName = getFirstWord(event.summary)

    console.log(
      `Sending reminders for event: ${event.summary} (ID: ${eventId})`
    )
    console.log(`Event details:`, JSON.stringify(event, null, 2))

    let notifiedEmails = this.remindersSent.get(eventId) || new Map()

    if (!event.attendees || event.attendees.length === 0) {
      console.log(`No attendees found for event: ${event.summary}`)
      return
    }

    console.log(`Number of attendees: ${event.attendees.length}`)

    for (let attendee of event.attendees) {
      if (attendee.email === organizerEmail) {
        console.log(`Skipping organizer: ${attendee.email}`)
        continue
      }

      console.log(`Processing attendee: ${attendee.email}`)
      const lastNotifiedDateTime = notifiedEmails.get(attendee.email)

      if (!lastNotifiedDateTime || lastNotifiedDateTime !== eventDateTime) {
        console.log(`Attempting to send email to ${attendee.email}`)
        try {
          const emailSent = await this.emailService.sendEmail(
            attendee.email,
            `🔔 Reminder: ${studentFirstName}'s Upcoming Spanish Class`,
            {
              studentName: studentName,
              eventDateTime: eventDateTime,
              eventLocation: eventLocation,
              eventTimezone: event.start.timeZone,
              eventDuration: eventDuration,
              teacherName: teacherName,
            }
          )

          if (emailSent) {
            console.log(`Email sent successfully to ${attendee.email}`)
            notifiedEmails.set(attendee.email, eventDateTime)
          } else {
            console.log(`Failed to send email to ${attendee.email}`)
          }
        } catch (error) {
          console.error(`Error sending email to ${attendee.email}:`, error)
        }
      } else {
        console.log(`Skipping email for ${attendee.email} - already notified`)
      }
    }

    this.remindersSent.set(eventId, notifiedEmails)
  }

  clearReminders() {
    this.remindersSent.clear()
    console.log("Cleared all stored reminders")
  }
}

module.exports = ReminderJob
