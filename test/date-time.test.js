import { formatToHours, formatDate } from "../lib/date-time"

describe("formatToHours should work with", () => {
  const runHourSuite = (suiteTitle, fullHours, hoursComponentInString) => {
    const baseMinutes = fullHours * 60

    describe(suiteTitle, () => {
      it("0 minutes", () => {
        expect(formatToHours(baseMinutes)).toBe(`${hoursComponentInString}h00`)
      })

      it("one-digit minutes", () => {
        expect(formatToHours(baseMinutes + 5)).toBe(
          `${hoursComponentInString}h05`
        )
      })

      it("two-digit minutes", () => {
        expect(formatToHours(baseMinutes + 27)).toBe(
          `${hoursComponentInString}h27`
        )
      })
    })
  }

  runHourSuite("0 hours", 0, "0")

  runHourSuite("single-digit hour", 3, "3")

  runHourSuite("two-digit hour", 12, "12")

  runHourSuite("three-digit hour", 645, "645")

  runHourSuite("four-digit hour", 1973, "1,973")
})

describe("formatDate should work with", () => {
  it("undefined date - returning an empty string", () => {
    expect(formatDate(undefined)).toBe("")
  })

  it("null date - returning an empty string", () => {
    expect(formatDate(null)).toBe("")
  })
})
