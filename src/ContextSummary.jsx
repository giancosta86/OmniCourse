import React from "react"
import { formatToHours } from "./date-time"

export default ({ totalMinutes, totalCourseCount }) => (
  <footer className="context-summary">
    <div className="total-duration">
      <label>Total time:</label> <span>{formatToHours(totalMinutes)}</span>
    </div>
    <div className="total-courses">
      <label>Total courses:</label> <span>{totalCourseCount}</span>
    </div>
  </footer>
)
