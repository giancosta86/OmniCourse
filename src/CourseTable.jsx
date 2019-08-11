import React from "react"
import _ from "lodash"
import { formatToHours, formatDate } from "./date-time"

export default ({ courses }) => (
  <table className="course-table">
    <thead>
      <tr>
        <td className="title">Title</td>
        <td className="duration">Duration</td>
        <td className="completion-date">Completion date</td>
        <td className="portal">Portal</td>
        <td className="certificate">Certificate</td>
      </tr>
    </thead>
    <tbody>
      {courses.map(course => (
        <tr key={_.join([course.title, course.completionDate], "|")}>
          <td className="title">
            {course.url ? (
              <a href={course.url}>{course.title}</a>
            ) : (
              course.title
            )}
          </td>
          <td className="duration">{formatToHours(course.minutes)}</td>
          <td className="completion-date">
            {formatDate(course.completionDate)}
          </td>
          <td className="portal">{course.portal || inferPortal(course)}</td>
          <td className="certificate">
            {course.certificateUrl && <a href={course.certificateUrl}>Show</a>}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

const inferPortal = course => {
  if (!course.url) {
    return null
  }

  if (course.url.includes("udemy.com/")) {
    return "Udemy"
  }

  if (course.url.includes("packtpub.com/")) {
    return "Packt"
  }

  if (course.url.includes("pluralsight.com/")) {
    return "Pluralsight"
  }

  if (course.url.includes("linkedin.com/")) {
    return "LinkedIn"
  }

  if (course.url.includes("university.mongodb.com/")) {
    return "MongoDB University"
  }
}
