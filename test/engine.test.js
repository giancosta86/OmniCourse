import { computeRootResult } from "../lib/engine"

describe("Compute tree results for", () => {
  it("linear structure", () => {
    let source = {
      Topic1: [
        {
          title: "Course A1",
          minutes: 9
        },

        {
          title: "Course A2",
          minutes: 11
        }
      ],

      Topic2: [
        {
          title: "Course B1",
          minutes: 40
        },

        {
          title: "Course B2",
          minutes: 3
        },

        {
          title: "Course B3",
          minutes: 2
        }
      ]
    }

    let expectedResult = {
      "Test Source": {
        _chartData: [["Topic1", 20], ["Topic2", 45]],
        _totalMinutes: 65,
        _totalCourseCount: 5,

        Topic1: {
          _totalMinutes: 20,
          _totalCourseCount: 2
        },

        Topic2: {
          _totalMinutes: 45,
          _totalCourseCount: 3
        }
      }
    }

    let actualResult = computeRootResult("Test Source", source)

    expect(actualResult).toEqual(expectedResult)
  })

  it("complex structure", () => {
    let source = {
      "Domain 1": {
        "Area 1": [
          {
            title: "Course A1",
            minutes: 13
          }
        ],

        "Area 2": [
          {
            title: "Course B1",
            minutes: 4
          },

          {
            title: "Course B2",
            minutes: 17
          },

          {
            title: "Course B3",
            minutes: 20
          },

          {
            title: "Course B4",
            minutes: 1
          }
        ]
      },

      "Domain 2": {
        "Area 3": [
          {
            title: "Course C1",
            minutes: 406
          },

          {
            title: "Course C2",
            minutes: 11
          }
        ]
      }
    }

    let expectedResult = {
      "Test Source": {
        _chartData: [["Domain 1", 55], ["Domain 2", 417]],

        _totalMinutes: 472,
        _totalCourseCount: 7,

        "Domain 1": {
          _chartData: [["Area 1", 13], ["Area 2", 42]],

          _totalMinutes: 55,
          _totalCourseCount: 5,

          "Area 1": {
            _totalMinutes: 13,
            _totalCourseCount: 1
          },

          "Area 2": {
            _totalMinutes: 42,
            _totalCourseCount: 4
          }
        },

        "Domain 2": {
          _chartData: [["Area 3", 417]],

          _totalMinutes: 417,
          _totalCourseCount: 2,

          "Area 3": {
            _totalMinutes: 417,
            _totalCourseCount: 2
          }
        }
      }
    }

    let actualResult = computeRootResult("Test Source", source)

    expect(actualResult).toEqual(expectedResult)
  })
})
