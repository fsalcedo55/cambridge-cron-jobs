const { google } = require("googleapis")
const fs = require("fs").promises
const path = require("path")

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
const CREDENTIALS_PATH = path.join(__dirname, "../../credentials.json")
const TOKEN_PATH = path.join(__dirname, "../../token.json")

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const oAuth2Client = new google.auth.OAuth2(
    key.client_id,
    key.client_secret,
    "http://localhost:3000/oauth2callback"
  )

  return getAccessToken(oAuth2Client)
}

function getAccessToken(oAuth2Client) {
  // Implementation remains the same as in the original file
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
