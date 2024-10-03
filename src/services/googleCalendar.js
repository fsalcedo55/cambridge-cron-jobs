const { google } = require("googleapis")

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

async function authorize() {
  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
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
