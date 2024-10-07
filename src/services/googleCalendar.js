const { google } = require("googleapis")
const { OAuth2Client } = require("google-auth-library")
const config = require("../config")

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

const oauth2Client = new OAuth2Client(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
)

async function authorize() {
  console.log("Authorizing Google Calendar...")
  console.log(
    "Running on Railway:",
    process.env.RAILWAY_STATIC_URL ? "Yes" : "No"
  )
  console.log("Node environment:", process.env.NODE_ENV)

  // Check if we have stored tokens
  if (config.google.accessToken && config.google.refreshToken) {
    oauth2Client.setCredentials({
      access_token: config.google.accessToken,
      refresh_token: config.google.refreshToken,
    })
    return oauth2Client
  } else {
    throw new Error("No stored tokens. Please authenticate first.")
  }
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
    fields:
      "items(id,summary,description,start,end,attendees,organizer,location)",
  })

  console.log("Raw API response:", JSON.stringify(response.data))
  return response.data.items || []
}

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  })
}

async function getTokens(code) {
  console.log("Getting tokens for code:", code)
  try {
    const { tokens } = await oauth2Client.getToken(code)
    console.log("Tokens received:", tokens)
    return { tokens }
  } catch (error) {
    console.error("Error getting tokens:", error)
    throw error
  }
}

module.exports = {
  authorize,
  getUpcomingEvents,
  getAuthUrl,
  getTokens,
}
