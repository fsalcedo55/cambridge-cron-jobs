/* eslint-env jest */

const ReminderJob = require("../../jobs/reminderJob")
const {
  authorize,
  getUpcomingEvents,
} = require("../../services/googleCalendar")

jest.mock("../../services/googleCalendar")
jest.mock("../../services/emailService")

describe("ReminderJob", () => {
  let reminderJob

  beforeEach(() => {
    reminderJob = new ReminderJob()
  })

  test("run method fetches and processes events", async () => {
    authorize.mockResolvedValue("mock-auth")
    getUpcomingEvents.mockResolvedValue([
      {
        id: "1",
        summary: "Test Event",
        start: { dateTime: "2023-04-01T10:00:00Z" },
        end: { dateTime: "2023-04-01T11:00:00Z" },
        attendees: [{ email: "test@example.com" }],
        organizer: { email: "organizer@example.com" },
      },
    ])

    await reminderJob.run()

    expect(authorize).toHaveBeenCalled()
    expect(getUpcomingEvents).toHaveBeenCalled()
    expect(reminderJob.emailService.sendEmail).toHaveBeenCalled()
  })

  // Add more tests for other methods...
})
