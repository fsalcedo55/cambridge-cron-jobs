const { authorize, getUpcomingEvents } = require("../services/googleCalendar")
const EmailService = require("../services/emailService")
const config = require("../config/index")

class ReminderJob {
  constructor() {
    this.remindersSent = new Map()
    this.emailService = new EmailService(config.email)
  }

  async run() {
    console.log("Running reminder job class...")
    try {
      const auth = await authorize()
      console.log("Authorization successful")
      const now = new Date()
      const twoHoursFromNow = new Date(now.getTime() + config.reminderWindow)
      console.log(
        `Checking for events between ${now.toISOString()} and ${twoHoursFromNow.toISOString()}`
      )

      for (let calendarId of config.calendars) {
        try {
          console.log(`Fetching events for calendar: ${calendarId}`)
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
    } catch (error) {
      console.error("Error in reminder job:", error)
    }
  }

  async sendReminderForEvent(event) {
    // Check if the event summary contains the word "cancel" (case-insensitive)
    if (event.summary && event.summary.toLowerCase().includes("cancel")) {
      console.log(`Skipping reminder for cancelled event: ${event.summary}`)
      return
    }

    function getFirstTwoWords(str) {
      const words = str.split(" ")
      const firstTwo = words.slice(0, 2)

      return firstTwo.join(" ")
    }

    function getFirstWord(str) {
      const words = str.split(" ")
      const firstWord = words[0]

      return firstWord
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

    // Parse the ISO strings into Date objects
    const startDate = new Date(event.start.dateTime)
    const endDate = new Date(event.end.dateTime)

    // Calculate the difference in milliseconds
    const diffInMs = endDate - startDate

    // Convert milliseconds to minutes
    const durationInMinutes = diffInMs / (1000 * 60)

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

    let notifiedEmails = this.remindersSent.get(eventId) || new Map()

    if (!event.attendees || event.attendees.length === 0) {
      console.log(`No attendees found for event: ${event.summary}`)
      return
    }

    for (let attendee of event.attendees) {
      // Skip the organizer
      if (attendee.email === organizerEmail) {
        console.log(`Skipping organizer: ${attendee.email}`)
        continue
      }

      console.log("event: ", event)

      console.log(`Processing attendee: ${attendee.email}`)
      const lastNotifiedDateTime = notifiedEmails.get(attendee.email)

      if (!lastNotifiedDateTime || lastNotifiedDateTime !== eventDateTime) {
        console.log(`Sending email to ${attendee.email}`)
        const emailSent = await this.emailService.sendEmail(
          attendee.email,
          `🔔 Reminder: ${studentFirstName}’s Upcoming Spanish Class`,
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
