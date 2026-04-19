import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Legend from "../Components/Legend"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"

const defaultMargin = { marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20 }
const MIN_LABEL_ANGLE = 0.35

const PieChart = ({
  data, valueAccessor, labelAccessor,
  colors, innerRadius, padAngle, showLabels,
  showLegend, legendPosition,
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

  const labelRadius = resolvedInnerRadius > 0
    ? (resolvedInnerRadius + outerRadius) / 2
    : outerRadius * 0.65

  const labelArc = d3.arc()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius)

  const arcs = pieGenerator(data)
  const displayLabels = showLabels !== false && typeof labelAccessor === 'function'

  const legendItems = typeof labelAccessor === 'function'
    ? data.map((d, i) => {
        const label = labelAccessor(d)
        return { color: colorScale(label !== undefined ? label : String(i)), label: String(label) }
      })
    : []

  const resolvedPosition = legendPosition || 'bottom'
  const isHorizontal = resolvedPosition === 'left' || resolvedPosition === 'right'
  const isLeading = resolvedPosition === 'top' || resolvedPosition === 'left'

  const chart = (
    <div className="PieChart" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
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

  const legend = showLegend && legendItems.length > 0
    ? <Legend items={legendItems} position={resolvedPosition} />
    : null

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: isHorizontal ? 'row' : 'column' }}>
      {isLeading && legend}
      {chart}
      {!isLeading && legend}
    </div>
  )
}

PieChart.propTypes = {
  data: PropTypes.array,
  valueAccessor: accessorPropsType,
  labelAccessor: accessorPropsType,
  colors: PropTypes.arrayOf(PropTypes.string),
  innerRadius: PropTypes.number,
  padAngle: PropTypes.number,
  showLabels: PropTypes.bool,
  /** Show a legend listing each slice's color and label. Default: false. */
  showLegend: PropTypes.bool,
  /** Position of the legend. One of 'top', 'bottom', 'left', 'right'. Default: 'bottom'. */
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

PieChart.defaultProps = {
  valueAccessor: d => d.value,
  labelAccessor: d => d.label,
}

export default PieChart
