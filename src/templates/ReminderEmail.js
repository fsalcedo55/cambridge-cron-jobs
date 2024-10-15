const React = require("react")
import PropTypes from "prop-types"
const { formatInTimeZone } = require("date-fns-tz")

const ReminderEmail = ({
  studentName,
  eventDateTime,
  eventLocation,
  eventTimezone,
  eventDuration,
  teacherName,
}) => {
  // Parse the ISO string to a Date object
  const date = new Date(eventDateTime)

  // Format the date with timezone information
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
              <strong>{studentName}</strong> has a Spanish class coming up soon!
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
                marginBottom: "30px",
                marginTop: "10px",
              }}
            />
          </div>
          <div>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgba(0, 0, 0, 0.75)",
                height: "1px",
                background: "none",
              }}
            />

            <p style={{ fontSize: "12px", fontStyle: "italic", color: "#666" }}>
              Want free classes? Refer a friend! <br />
              Copy and send them this link:{" "}
              <a
                href="https://tally.so/r/w4LbEb"
                style={{
                  wordBreak: "break-all",
                  backgroundColor: "#f0f0f0",
                  padding: "5px",
                  display: "inline-block",
                  margin: "5px 0",
                  borderRadius: "3px",
                }}
              >
                https://tally.so/r/w4LbEb
              </a>
              <br />
              When your friend signs up for their first month, you&apos;ll both
              receive 2 free bonus classes!
            </p>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgba(0, 0, 0, 0.75)",
                height: "1px",
                background: "none",
              }}
            />
          </div>
          <div>
            <p style={{ fontSize: "10px", color: "#666", marginBottom: "0px" }}>
              <strong>Questions or concerns?</strong>
            </p>
            <p
              style={{
                fontSize: "10px",
                color: "#666",
                marginBottom: "20px",
                marginTop: "0px",
              }}
            >
              Please don&apos;t hesitate to reply to this email or call/text{" "}
              <a
                href="tel:786-588-4590"
                style={{ color: "#666", textDecoration: "underline" }}
              >
                786-588-4590
              </a>
              .
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
  isTenHourReminder: PropTypes.bool.isRequired,
}

module.exports = ReminderEmail
