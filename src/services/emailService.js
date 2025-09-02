const React = require("react")
const ReactDOMServer = require("react-dom/server")
const nodemailer = require("nodemailer")
const ReminderEmail = require("../templates/ReminderEmail")

class EmailService {
  constructor(config) {
    console.log("Initializing EmailService...")
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: config,
      // Add basic timeouts to match Railway's network characteristics
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 30000, // 30 seconds
    })
  }

  async sendEmail(
    to,
    subject,
    {
      studentName,
      eventDateTime,
      eventLocation,
      eventTimezone,
      eventDuration,
      teacherName,
    }
  ) {
    console.log(`Attempting to send email to ${to}`)
    try {
      console.log(
        "Email data:",
        JSON.stringify(
          {
            studentName,
            eventDateTime,
            eventLocation,
            eventTimezone,
            eventDuration,
            teacherName,
          },
          null,
          2
        )
      )

      if (
        !studentName ||
        !eventDateTime ||
        !eventLocation ||
        !eventTimezone ||
        !eventDuration ||
        !teacherName
      ) {
        throw new Error("Missing required email properties")
      }

      const emailHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ReminderEmail, {
          studentName,
          eventDateTime,
          eventLocation,
          eventTimezone,
          eventDuration,
          teacherName,
        })
      )

      const mailOptions = {
        from: '"Spanish For Us" <spanishforuskids@gmail.com>',
        to,
        subject,
        html: emailHtml,
      }

      console.log(`Mail options: ${JSON.stringify(mailOptions, null, 2)}`)
      const result = await this.transporter.sendMail(mailOptions)
      console.log(`Email sent to ${to}. Message ID: ${result.messageId}`)
      return true
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error)
      console.error("Error stack:", error.stack)
      throw error
    }
  }
}

module.exports = EmailService
