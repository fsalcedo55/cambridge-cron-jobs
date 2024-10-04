const { google } = require("googleapis")
const config = require("../config")

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

async function authorize() {
  console.log("Authorizing Google Calendar...")
  console.log("Google config:", config.google)

  const clientEmail = config.google.clientEmail
  const privateKey = config.google.privateKey

  if (!clientEmail) {
    throw new Error("GOOGLE_CLIENT_EMAIL is not set in the config")
  }
  if (!privateKey) {
    throw new Error("GOOGLE_PRIVATE_KEY is not set in the config")
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
  console.log(`Fetching events for calendar ${calendarId}`)
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
