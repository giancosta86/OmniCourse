import React, { useState } from "react"
import PathBar from "./PathBar"
import { ContextPath } from "./ContextPath"
import _ from "lodash"
import ContextSummary from "./ContextSummary"
import DrillDownChart from "./DrillDownChart"
import CourseTable from "./CourseTable"
import { computeRootResult } from "./engine"

export default ({ loader, sourceData, colors, className, rootLabel }) => {
  let rootContexts = Object.keys(sourceData)
  let defaultRootContext = _.first(rootContexts)
  let defaultPath = new ContextPath(defaultRootContext)

  let rootContextResultCache = {}

  let initialState = computeState(
    sourceData,
    rootContextResultCache,
    defaultPath
  )

  let [state, setState] = useState(initialState)

  const handlePathRequest = requestedPath =>
    setState(computeState(sourceData, rootContextResultCache, requestedPath))

  return (
    <div className={className}>
      <PathBar
        rootLabel={rootLabel}
        rootContexts={rootContexts}
        path={state.path}
        onPathRequest={handlePathRequest}
      />

      {!state.courses && (
        <DrillDownChart
          loader={loader}
          data={state.chartData}
          title={state.path.getLastContext()}
          colors={colors}
          onDrillDownRequest={context =>
            handlePathRequest(state.path.concat(context))
          }
        />
      )}

      {state.courses && (
        <div className="table-container">
          <CourseTable courses={state.courses} />
        </div>
      )}

      <ContextSummary
        totalCourseCount={state.totalCourseCount}
        totalMinutes={state.totalMinutes}
      />
    </div>
  )
}

const computeState = (sourceData, rootContextResultCache, requestedPath) => {
  let rootContext = requestedPath.getRootContext()
  let rootContextResult = rootContextResultCache[rootContext]

  if (!rootContextResult) {
    rootContextResult = computeRootResult(rootContext, sourceData[rootContext])
    rootContextResultCache[rootContext] = rootContextResult
  }

  let contextResult = requestedPath.indexObject(rootContextResult)

  return {
    path: requestedPath,
    totalCourseCount: contextResult._totalCourseCount,
    totalMinutes: contextResult._totalMinutes,
    chartData: _.concat([["Label", "Value"]], contextResult._chartData),
    courses: (contextResult._chartData
      ? () => null
      : () => requestedPath.indexObject(sourceData))()
  }
}
