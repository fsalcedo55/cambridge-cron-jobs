/* eslint-env jest */

const EmailService = require("../emailService")
const nodemailer = require("nodemailer")

jest.mock("nodemailer")

describe("EmailService", () => {
  let emailService
  let mockSendMail

  beforeEach(() => {
    mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-message-id" })
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail })
    emailService = new EmailService({
      user: "test@example.com",
      pass: "password",
    })
  })

  test("sendEmail sends email successfully", async () => {
    const to = "recipient@example.com"
    const subject = "Test Subject"
    const emailData = {
      studentName: "John Doe",
      eventDateTime: "2023-04-01T10:00:00Z",
      eventLocation: "https://zoom.us/test",
      eventTimezone: "UTC",
      eventDuration: "60",
      teacherName: "Jane Smith",
    }

    const result = await emailService.sendEmail(to, subject, emailData)

    expect(result).toBe(true)
    expect(mockSendMail).toHaveBeenCalledTimes(1)
    expect(mockSendMail.mock.calls[0][0]).toMatchObject({
      from: '"Spanish For Us" <spanishforuskids@gmail.com>',
      to,
      subject,
      html: expect.any(String),
    })
  })

  it("sendEmail handles errors", async () => {
    const mockSendMail = jest.fn().mockRejectedValue(new Error("Test error"))
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail })

    const emailService = new EmailService()

    await expect(
      emailService.sendEmail("test@example.com", "Test Subject", {
        studentName: "John Doe",
        eventDateTime: "2023-04-01T10:00:00Z",
        eventLocation: "https://zoom.us/test",
        eventTimezone: "UTC",
        eventDuration: "60",
        teacherName: "Jane Smith",
      })
    ).rejects.toThrow("Test error")

    expect(mockSendMail).toHaveBeenCalled()
  })
})
