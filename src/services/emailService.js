const React = require("react")
const ReactDOMServer = require("react-dom/server")
const nodemailer = require("nodemailer")
const sgMail = require("@sendgrid/mail")
const ReminderEmail = require("../templates/ReminderEmail")

class EmailService {
  constructor(config) {
    console.log("Initializing EmailService...")
    
    // Check if SendGrid API key is available
    this.useSendGrid = !!process.env.SENDGRID_API_KEY
    
    if (this.useSendGrid) {
      console.log("🚀 Using SendGrid for email delivery")
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      this.fromEmail = process.env.SENDGRID_FROM_EMAIL || config.user || "spanishforuskids@gmail.com"
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
    }
  ) {
    console.log(`Attempting to send email to ${to} using ${this.useSendGrid ? 'SendGrid' : 'Gmail SMTP'}`)
    
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

      if (this.useSendGrid) {
        // Use SendGrid API (HTTPS)
        const msg = {
          to: to,
          from: {
            email: this.fromEmail,
            name: 'Spanish For Us'
          },
          subject: subject,
          html: emailHtml,
        }

        console.log(`SendGrid message: ${JSON.stringify(msg, null, 2)}`)
        const response = await sgMail.send(msg)
        console.log(`Email sent via SendGrid to ${to}. Response: ${response[0].statusCode}`)
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
        console.log(`Email sent via Gmail to ${to}. Message ID: ${result.messageId}`)
        return true
      }
      
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error)
      console.error("Error stack:", error.stack)
      
      if (this.useSendGrid && error.response) {
        console.error("SendGrid error details:", error.response.body)
      }
      
      return false // Return false instead of throwing, so job continues
    }
  }
}

module.exports = EmailService
