import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Line from "../Components/Line"
import Circles from "../Components/Circles"
import Axis from "../Cartesian/Axis"
import Gradient from "../Components/Gradient"
import Legend from "../Components/Legend"
import { useChartDimensions, accessorPropsType, useUniqueId } from "../Utils/utils"

const formatDate = d3.timeFormat("%-b %-d")
const defaultGradientColors = ["rgb(226, 222, 243)", "#f8f9fa"]
const DEFAULT_COLOR = '#9980FA'

const Timeline = ({
  data, xAccessor, yAccessor, xLabel, yLabel,
  color, gradientColors: gradientColorsProp,
  interpolation, showArea, showDots,
  formatXTick, formatYTick,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const gradientId = useUniqueId("Timeline-gradient")

  if (!data || data.length === 0) return null

  const resolvedGradientColors = gradientColorsProp
    || (color ? [`${color}55`, "rgba(255,255,255,0)"] : defaultGradientColors)

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const y0AccessorScaled = yScale(yScale.domain()[0])

  const legendItems = yLabel
    ? [{ color: color || DEFAULT_COLOR, label: yLabel }]
    : []
  const resolvedPosition = legendPosition || 'bottom'
  const isHorizontal = resolvedPosition === 'left' || resolvedPosition === 'right'
  const isLeading = resolvedPosition === 'top' || resolvedPosition === 'left'

  const chart = (
    <div className="Timeline" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      <Chart dimensions={dimensions} label={yLabel || xLabel}>
        <defs>
          <Gradient id={gradientId} colors={resolvedGradientColors} x2="0" y2="100%" />
        </defs>
        <Axis dimension="x" scale={xScale} formatTick={formatXTick || formatDate} label={xLabel} />
        <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel} />
        {showArea !== false && (
          <Line
            type="area"
            data={data}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            y0Accessor={y0AccessorScaled}
            style={{ fill: `url(#${gradientId})` }}
            interpolation={interpolation}
          />
        )}
        <Line
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          style={color ? { stroke: color } : undefined}
          interpolation={interpolation}
        />
        {showDots && (
          <Circles
            data={data}
            keyAccessor={(d, i) => i}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            color={color}
          />
        )}
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

Timeline.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  color: PropTypes.string,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  interpolation: PropTypes.func,
  showArea: PropTypes.bool,
  showDots: PropTypes.bool,
  formatXTick: PropTypes.func,
  formatYTick: PropTypes.func,
  /** Show a legend for the chart. Default: false. */
  showLegend: PropTypes.bool,
  /** Position of the legend. One of 'top', 'bottom', 'left', 'right'. Default: 'bottom'. */
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

Timeline.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  showArea: true,
  showDots: false,
}

export default Timeline
