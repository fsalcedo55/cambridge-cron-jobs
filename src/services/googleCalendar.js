const { google } = require("googleapis")

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

async function authorize() {
  console.log(
    "GOOGLE_CLIENT_EMAIL:",
    process.env.GOOGLE_CLIENT_EMAIL ? "Set" : "Not set"
  )
  console.log(
    "GOOGLE_PRIVATE_KEY:",
    process.env.GOOGLE_PRIVATE_KEY ? "Set" : "Not set"
  )

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!clientEmail) {
    throw new Error("GOOGLE_CLIENT_EMAIL environment variable is not set")
  }
  if (!privateKey) {
    throw new Error("GOOGLE_PRIVATE_KEY environment variable is not set")
  }

  const jwtClient = new google.auth.JWT(
    clientEmail,
    null,
    privateKey.replace(/\\n/g, "\n"),
    SCOPES
  )

  await jwtClient.authorize()
  return jwtClient
}

async function getUpcomingEvents(auth, calendarId, timeMin, timeMax) {
  const calendar = google.calendar({ version: "v3", auth })
  const response = await calendar.events.list({
    calendarId: calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  })

  return response.data.items || []
}

module.exports = { authorize, getUpcomingEvents }
