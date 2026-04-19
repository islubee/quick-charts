import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Bars from "../Components/Bars"
import Axis from "../Cartesian/Axis"
import Gradient from "../Components/Gradient"
import { useChartDimensions, accessorPropsType, useUniqueId } from "../Utils/utils";

const defaultGradientColors = ["#9980FA", "rgb(226, 222, 243)"]

const Histogram = ({
  data, xAccessor, xLabel, yLabel,
  color, gradientColors: gradientColorsProp, thresholds,
  formatXTick, formatYTick,
}) => {
  const gradientId = useUniqueId("Histogram-gradient")
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  if (!data || data.length === 0) return null

  const numberOfThresholds = thresholds || 9

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice(numberOfThresholds)

  const binsGenerator = d3
    .histogram()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds))

  const bins = binsGenerator(data)

  const yAccessor = d => d.length
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const barPadding = 2

  const xAccessorScaled = d => xScale(d.x0) + barPadding
  const yAccessorScaled = d => yScale(yAccessor(d))
  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0) - barPadding
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  const resolvedGradientColors = gradientColorsProp || defaultGradientColors
  const barStyle = color
    ? { fill: color }
    : { fill: `url(#${gradientId})` }

  return (
    <div className="Histogram" ref={ref} style={{ width: '100%', height: '100%' }}>
      <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
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
          formatTick={formatXTick}
          label={xLabel}
        />
        <Axis
          dimension="y"
          scale={yScale}
          formatTick={formatYTick}
          label={yLabel || "Count"}
        />
        <Bars
          data={bins}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          style={barStyle}
        />
      </Chart>
    </div>
  )
}

Histogram.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  /** Solid fill color for bars. When set, overrides gradientColors. */
  color: PropTypes.string,
  /** Two-element array [topColor, bottomColor] for the bar gradient fill. */
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  /** Number of histogram bins. Default: 9. */
  thresholds: PropTypes.number,
  /** Custom formatter for x-axis tick labels. Defaults to d3.format(","). */
  formatXTick: PropTypes.func,
  /** Custom formatter for y-axis tick labels. Defaults to d3.format(","). */
  formatYTick: PropTypes.func,
}

Histogram.defaultProps = {
  xAccessor: d => d.x,
}

export default Histogram
