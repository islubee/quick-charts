import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Bars from "../Components/Bars"
import Axis from "../Cartesian/Axis"
import Gradient from "../Components/Gradient"
import Legend from "../Components/Legend"
import { useChartDimensions, accessorPropsType, useUniqueId } from "../Utils/utils"

const defaultGradientColors = ["#9980FA", "rgb(226, 222, 243)"]
const DEFAULT_COLOR = '#9980FA'

const Histogram = ({
  data, xAccessor, xLabel, yLabel,
  color, gradientColors: gradientColorsProp, thresholds,
  formatXTick, formatYTick,
  showLegend, legendPosition,
}) => {
  const gradientId = useUniqueId("Histogram-gradient")
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })

  if (!data || data.length === 0) return null

  const numberOfThresholds = thresholds || 9

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice(numberOfThresholds)

  const binsGenerator = d3.histogram()
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
  const barStyle = color ? { fill: color } : { fill: `url(#${gradientId})` }

  const legendItems = xLabel
    ? [{ color: color || DEFAULT_COLOR, label: xLabel }]
    : []
  const resolvedPosition = legendPosition || 'bottom'
  const isHorizontal = resolvedPosition === 'left' || resolvedPosition === 'right'
  const isLeading = resolvedPosition === 'top' || resolvedPosition === 'left'

  const chart = (
    <div className="Histogram" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
        <defs>
          <Gradient id={gradientId} colors={resolvedGradientColors} x2="0" y2="100%" />
        </defs>
        <Axis dimension="x" scale={xScale} formatTick={formatXTick} label={xLabel} />
        <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel || "Count"} />
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

Histogram.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  color: PropTypes.string,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  thresholds: PropTypes.number,
  formatXTick: PropTypes.func,
  formatYTick: PropTypes.func,
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

Histogram.defaultProps = {
  xAccessor: d => d.x,
}

export default Histogram
