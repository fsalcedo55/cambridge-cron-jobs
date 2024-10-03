const React = require("react")
const ReactDOMServer = require("react-dom/server")
const nodemailer = require("nodemailer")
const ReminderEmail = require("../templates/ReminderEmail")

class EmailService {
  constructor(config) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: config,
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
    try {
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

      console.log(`Attempting to send email to ${to}`)

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

      console.log(`Mail options: ${JSON.stringify(mailOptions)}`)
      const result = await this.transporter.sendMail(mailOptions)
      console.log(`Email sent to ${to}. Message ID: ${result.messageId}`)
      return true
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error)
      throw error // Throw the error instead of returning false
    }
  }
}

module.exports = EmailService
