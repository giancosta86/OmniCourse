import React, { useState, useEffect } from "react"
import Chart from "react-google-charts"

export default ({ loader, data, title, colors, onDrillDownRequest }) => {
  let [isLandscape, setLandscape] = useState(true)

  useEffect(() => {
    setLandscape(window.innerWidth > window.innerHeight)
  })

  return (
    <Chart
      className="course-chart"
      chartType="PieChart"
      loader={loader}
      data={data}
      options={{
        title: `${title} (in minutes)`,
        width: "100%",
        height: "70vh",

        chartArea: {
          width: "95%",
          height: isLandscape ? "85%" : "60%"
        },

        colors: colors,

        tooltip: {
          trigger: "hover",
          isHtml: true,
          showColorCode: true
        },

        legend: {
          position: isLandscape ? "labeled" : "top",
          maxLines: 4
        },

        pieSliceText: "percentage"
      }}
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper.getChart()
            const selection = chart.getSelection()

            if (selection.length === 1) {
              const [selectedItem] = selection
              const { row } = selectedItem

              const dataTable = chartWrapper.getDataTable()

              const requestedContext = dataTable.getValue(row, 0)

              onDrillDownRequest(requestedContext)
            }
          }
        }
      ]}
    />
  )
}
