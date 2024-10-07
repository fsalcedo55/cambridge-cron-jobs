const express = require("express")
const { getAuthUrl, getTokens } = require("../services/googleCalendar")
// const config = require("../config");

const router = express.Router()

router.get("/auth/google", (req, res) => {
  console.log("Initiating Google Auth...")
  const authUrl = getAuthUrl()
  console.log("Auth URL:", authUrl)
  res.redirect(authUrl)
})

router.get("/auth/google/callback", async (req, res) => {
  console.log("Callback received. Query:", req.query)
  const { code } = req.query
  if (!code) {
    console.error("No code received in callback")
    return res.status(400).send("No code received")
  }
  try {
    console.log("Attempting to get tokens...")
    const { tokens } = await getTokens(code)
    console.log("Tokens received:", tokens)
    // Store these tokens securely (e.g., in a database)
    console.log("Access token:", tokens.access_token)
    console.log("Refresh token:", tokens.refresh_token)
    res.send("Authentication successful! You can close this window.")
  } catch (error) {
    console.error("Error getting tokens:", error)
    res.status(500).send("Authentication failed: " + error.message)
  }
})

module.exports = router
