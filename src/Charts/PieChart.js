import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"

const defaultMargin = { marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20 }

const PieChart = ({
  data, valueAccessor, labelAccessor,
  colors, innerRadius, padAngle, showLabels,
}) => {
  const [ref, dimensions] = useChartDimensions(defaultMargin)

  if (!data || data.length === 0) return null

  const outerRadius = Math.min(dimensions.boundedWidth, dimensions.boundedHeight) / 2
  const cx = dimensions.boundedWidth / 2
  const cy = dimensions.boundedHeight / 2

  const colorScale = d3.scaleOrdinal(
    Array.isArray(colors) ? colors : d3.schemeSet2
  )

  const resolvedInnerRadius = typeof innerRadius === 'number'
    ? outerRadius * Math.min(Math.max(innerRadius, 0), 0.95)
    : 0

  const pieGenerator = d3.pie()
    .value(valueAccessor)
    .padAngle(padAngle !== undefined ? padAngle : 0.02)
    .sort(null)

  const arcGenerator = d3.arc()
    .innerRadius(resolvedInnerRadius)
    .outerRadius(outerRadius)

  // Labels sit at 80% of the outer radius (or midpoint for donuts)
  const labelRadius = resolvedInnerRadius > 0
    ? (resolvedInnerRadius + outerRadius) / 2
    : outerRadius * 0.65

  const labelArc = d3.arc()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius)

  const arcs = pieGenerator(data)
  const displayLabels = showLabels !== false && typeof labelAccessor === 'function'
  // Hide labels on slices narrower than ~20° to prevent overlap
  const MIN_LABEL_ANGLE = 0.35

  return (
    <div className="PieChart" ref={ref} style={{ width: '100%', height: '100%' }}>
      <Chart dimensions={dimensions} label="Pie chart">
        <g transform={`translate(${cx}, ${cy})`}>
          {arcs.map((arc, i) => {
            const label = labelAccessor ? labelAccessor(data[i]) : String(i)
            const sliceAngle = arc.endAngle - arc.startAngle
            return (
              <g key={i} className="PieChart__slice-group">
                <path
                  className="PieChart__slice"
                  d={arcGenerator(arc)}
                  style={{ fill: colorScale(label) }}
                />
                {displayLabels && sliceAngle >= MIN_LABEL_ANGLE && (
                  <text
                    className="PieChart__label"
                    transform={`translate(${labelArc.centroid(arc)})`}
                    style={{ textAnchor: 'middle', dominantBaseline: 'middle' }}
                  >
                    {label}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </Chart>
    </div>
  )
}

PieChart.propTypes = {
  data: PropTypes.array,
  /** Returns a numeric value from each datum — determines slice size. */
  valueAccessor: accessorPropsType,
  /** Returns a label string from each datum — used for color mapping and optional text. */
  labelAccessor: accessorPropsType,
  /** Array of color strings for the slices. Defaults to d3.schemeSet2. */
  colors: PropTypes.arrayOf(PropTypes.string),
  /** Donut hole size as a fraction of the outer radius (0 = full pie, 0.5 = half donut). Default: 0. */
  innerRadius: PropTypes.number,
  /** Gap between slices in radians. Default: 0.02. */
  padAngle: PropTypes.number,
  /** Show label text inside each slice. Default: true when labelAccessor is provided. */
  showLabels: PropTypes.bool,
}

PieChart.defaultProps = {
  valueAccessor: d => d.value,
  labelAccessor: d => d.label,
}

export default PieChart
