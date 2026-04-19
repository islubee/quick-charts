import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Line from "../Components/Line"
import Circles from "../Components/Circles"
import Axis from "../Cartesian/Axis"
import Gradient from "../Components/Gradient";
import { useChartDimensions, accessorPropsType, useUniqueId } from "../Utils/utils";

const formatDate = d3.timeFormat("%-b %-d")
const defaultGradientColors = ["rgb(226, 222, 243)", "#f8f9fa"]

const Timeline = ({
  data, xAccessor, yAccessor, xLabel, yLabel,
  color, gradientColors: gradientColorsProp,
  interpolation, showArea, showDots,
  formatXTick, formatYTick,
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

  return (
    <div className="Timeline" ref={ref} style={{ width: '100%', height: '100%' }}>
      <Chart dimensions={dimensions} label={yLabel || xLabel}>
        <defs>
          <Gradient
            id={gradientId}
            colors={resolvedGradientColors}
            x2="0"
            y2="100%"
          />
        </defs>
        <Axis
          dimension="x"
          scale={xScale}
          formatTick={formatXTick || formatDate}
          label={xLabel}
        />
        <Axis
          dimension="y"
          scale={yScale}
          formatTick={formatYTick}
          label={yLabel}
        />
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
}

Timeline.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  /** Primary color for the line stroke. Also tints the area gradient when gradientColors is not set. */
  color: PropTypes.string,
  /** Two-element array [topColor, bottomColor] for the area fill gradient. */
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  /** D3 curve factory for the line (e.g. d3.curveBasis). Defaults to d3.curveMonotoneX. */
  interpolation: PropTypes.func,
  /** Show the filled area beneath the line. Default: true. */
  showArea: PropTypes.bool,
  /** Overlay a dot at each data point. Default: false. */
  showDots: PropTypes.bool,
  /** Custom formatter for x-axis tick labels. Defaults to "MMM D" date format. */
  formatXTick: PropTypes.func,
  /** Custom formatter for y-axis tick labels. Defaults to d3.format(","). */
  formatYTick: PropTypes.func,
}

Timeline.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  showArea: true,
  showDots: false,
}

export default Timeline
