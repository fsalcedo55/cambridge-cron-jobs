const React = require("react")
import PropTypes from "prop-types"
import { parseISO } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

const ReminderEmail = ({
  studentName,
  eventDateTime,
  eventLocation,
  eventTimezone,
  eventDuration,
  teacherName,
}) => {
  // Parse the ISO string to a Date object
  const date = parseISO(eventDateTime)

  // Format the date without timezone information
  const formattedDate = formatInTimeZone(
    date,
    eventTimezone,
    "EEEE, MMMM d, yyyy 'at' h:mm a"
  )

  return (
    <html>
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "white",
          margin: 0,
          padding: 0,
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <div>
            <p
              style={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}
            >
              Hi there!
            </p>
            <p
              style={{ fontSize: "16px", color: "#666", marginBottom: "40px" }}
            >
              <strong>{studentName}</strong> has a Spanish class coming up!
            </p>
            <p
              style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}
            >
              📆 Date and Time: <strong>{formattedDate}</strong>
            </p>
            <p
              style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}
            >
              ⏰ Timezone: <strong>{eventTimezone}</strong>
            </p>
            <p
              style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}
            >
              ⏳ Class Duration: <strong>{eventDuration} minutes</strong>
            </p>
            <p
              style={{ fontSize: "16px", color: "#666", marginBottom: "40px" }}
            >
              👩‍🏫 Teacher: <strong>{teacherName}</strong>
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <a
                href={eventLocation}
                style={{
                  backgroundColor: "#007ee6",
                  borderRadius: "22px",
                  color: "#fff",
                  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
                  fontSize: "15px",
                  textDecoration: "none",
                  textAlign: "center",
                  display: "inline-block",
                  width: "210px",
                  padding: "14px 7px",
                  lineHeight: "100%",
                }}
              >
                <span style={{ fontSize: "20px" }}>👉</span>{" "}
                <strong>Join Zoom Class</strong>
              </a>
            </div>

            <p
              style={{
                fontSize: "16px",
                color: "#666",
                marginBottom: "20px",
                marginTop: "30px",
              }}
            >
              Gracias,
            </p>
            <img
              src="https://i.imgur.com/mr687Zx.png"
              width="170"
              height="50"
              alt="Spanish For Us Logo"
              style={{
                display: "block",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            />
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#666", marginBottom: "0px" }}>
              <strong>Questions or concerns?</strong>
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "20px",
                marginTop: "0px",
              }}
            >
              Please don&apos;t hesitate to reply to this email or call/text
              786-588-4590.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}

ReminderEmail.propTypes = {
  studentName: PropTypes.string.isRequired,
  eventDateTime: PropTypes.string.isRequired,
  eventLocation: PropTypes.string.isRequired,
  eventTimezone: PropTypes.string.isRequired,
  eventDuration: PropTypes.string.isRequired,
  teacherName: PropTypes.string.isRequired,
}

module.exports = ReminderEmail
