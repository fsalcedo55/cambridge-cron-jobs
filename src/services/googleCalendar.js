const { google } = require("googleapis")

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

async function authorize() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!clientEmail || !privateKey) {
    throw new Error(
      "GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY environment variables are not set"
    )
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
