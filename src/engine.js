import _ from "lodash"

export const computeRootResult = (rootContextName, rootContextData) => ({
  [rootContextName]: computeContextResult(rootContextData)
})

const computeContextResult = contextData =>
  _.isArray(contextData)
    ? computeResultFromCourses(contextData)
    : computeResultFromSubTree(contextData)

const computeResultFromCourses = courses => ({
  _totalMinutes: _.sum(courses.map(course => course.minutes)),
  _totalCourseCount: courses.length
})

const computeResultFromSubTree = subTree => {
  let subContextResults = Object.entries(subTree).reduce(
    (cumulatedResults, [subContextName, subContextData]) => ({
      [subContextName]: computeContextResult(subContextData),
      ...cumulatedResults
    }),
    {}
  )

  return {
    ...subContextResults,

    _chartData: Object.keys(subTree).map(subContextName => [
      subContextName,
      subContextResults[subContextName]._totalMinutes
    ]),

    _totalMinutes: _.sum(
      Object.values(subContextResults).map(
        subContextResult => subContextResult._totalMinutes
      )
    ),

    _totalCourseCount: _.sum(
      Object.values(subContextResults).map(
        subContextResult => subContextResult._totalCourseCount
      )
    )
  }
}
