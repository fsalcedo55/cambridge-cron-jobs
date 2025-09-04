const React = require("react")
const ReactDOMServer = require("react-dom/server")
const nodemailer = require("nodemailer")
const { Resend } = require("resend")
const ReminderEmail = require("../templates/ReminderEmail")

class EmailService {
  constructor(config) {
    console.log("Initializing EmailService...")

    // Check if Resend API key is available
    this.useResend = !!process.env.RESEND_API_KEY

    if (this.useResend) {
      console.log("🚀 Using Resend for email delivery")
      this.resend = new Resend(process.env.RESEND_API_KEY)
      this.fromEmail = "no-reply@spanishforuskids.com"
    } else {
      console.log("📧 Using Gmail SMTP for email delivery")
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: config,
        // Add basic timeouts to match Railway's network characteristics
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 30000, // 30 seconds
        socketTimeout: 30000, // 30 seconds
      })
    }
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
      isTenHourReminder = false,
    }
  ) {
    console.log(
      `Attempting to send email to ${to} using ${
        this.useResend ? "Resend" : "Gmail SMTP"
      }`
    )

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
            isTenHourReminder,
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
          isTenHourReminder,
        })
      )

      if (this.useResend) {
        // Use Resend API (HTTPS)
        const email = {
          from: `Spanish For Us <${this.fromEmail}>`,
          to: [to],
          subject: subject,
          html: emailHtml,
        }

        console.log(`Resend message: ${JSON.stringify(email, null, 2)}`)
        const { data, error } = await this.resend.emails.send(email)

        if (error) {
          // Handle rate limiting by waiting and retrying once
          if (error.name === "rate_limit_exceeded") {
            console.log("Rate limit hit, waiting 1 second before retry...")
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const { data: retryData, error: retryError } =
              await this.resend.emails.send(email)
            if (retryError) {
              throw new Error(
                `Resend error after retry: ${JSON.stringify(retryError)}`
              )
            }
            console.log(
              `Email sent via Resend to ${to} after retry. Message ID: ${retryData.id}`
            )
            return true
          }
          throw new Error(`Resend error: ${JSON.stringify(error)}`)
        }

        console.log(`Email sent via Resend to ${to}. Message ID: ${data.id}`)
        return true
      } else {
        // Use Gmail SMTP (fallback for local development)
        const mailOptions = {
          from: '"Spanish For Us" <spanishforuskids@gmail.com>',
          to,
          subject,
          html: emailHtml,
        }

        console.log(`Mail options: ${JSON.stringify(mailOptions, null, 2)}`)
        const result = await this.transporter.sendMail(mailOptions)
        console.log(
          `Email sent via Gmail to ${to}. Message ID: ${result.messageId}`
        )
        return true
      }
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error)
      console.error("Error stack:", error.stack)

      if (
        this.useResend &&
        error.message &&
        error.message.includes("Resend error")
      ) {
        console.error("Resend error details:", error.message)
      }

      return false // Return false instead of throwing, so job continues
    }
  }
}

module.exports = EmailService
