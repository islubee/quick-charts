import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Bars from "../Components/Bars"
import Axis from "../Cartesian/Axis"
import Gradient from "../Components/Gradient"
import ChartLayout from "../Components/ChartLayout"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType, useUniqueId } from "../Utils/utils"
import { useTooltip } from "../Utils/useTooltip"

const DEFAULT_GRADIENT = ["#9980FA", "rgb(226, 222, 243)"]
const DEFAULT_COLOR = '#9980FA'
const fmt = d3.format(",")
const fmtFixed = d3.format(",.2~f")
const BAR_PADDING = 2

const Histogram = ({
  data, xAccessor, xLabel, yLabel,
  color, gradientColors, thresholds,
  formatXTick, formatYTick,
  showLegend, legendPosition,
}) => {
  const gradientId = useUniqueId("Histogram-gradient")
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const { wrapperRef, tooltip, showTooltip, moveTooltip, hideTooltip } = useTooltip()

  const numberOfThresholds = thresholds || 9

  const xScale = useMemo(() =>
    d3.scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice(numberOfThresholds),
    [data, xAccessor, dimensions.boundedWidth, numberOfThresholds]
  )

  const bins = useMemo(() =>
    d3.histogram()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(xScale.ticks(numberOfThresholds))(data),
    [xScale, xAccessor, numberOfThresholds, data]
  )

  const yScale = useMemo(() =>
    d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) || 0])
      .range([dimensions.boundedHeight, 0])
      .nice(),
    [bins, dimensions.boundedHeight]
  )

  const legendItems = useMemo(() =>
    xLabel ? [{ color: color || DEFAULT_COLOR, label: xLabel }] : [],
    [xLabel, color]
  )

  const resolvedGradientColors = gradientColors || DEFAULT_GRADIENT
  const barStyle = useMemo(() =>
    color ? { fill: color } : { fill: `url(#${gradientId})` },
    [color, gradientId]
  )

  const tickFmt = formatXTick || fmtFixed

  const handleEnter = useCallback((d, i, e) => showTooltip(e, { d }), [showTooltip])
  const handleMove = useCallback((d, i, e) => moveTooltip(e), [moveTooltip])

  if (!data || data.length === 0) return null

  const xAccessorScaled = d => xScale(d.x0) + BAR_PADDING
  const yAccessorScaled = d => yScale(d.length)
  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0) - BAR_PADDING
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(d.length)

  return (
    <ChartLayout wrapperRef={wrapperRef} legendItems={legendItems} showLegend={showLegend} legendPosition={legendPosition} tooltip={
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.d && (
          <>
            <div><strong>{xLabel || 'Range'}</strong>: {tickFmt(tooltip.d.x0)} – {tickFmt(tooltip.d.x1)}</div>
            <div><strong>Count</strong>: {fmt(tooltip.d.length)}</div>
          </>
        )}
      </Tooltip>
    }>
      <div className="Histogram" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
          <defs>
            <Gradient id={gradientId} colors={resolvedGradientColors} x2="0" y2="100%" />
          </defs>
          <Axis dimension="x" scale={xScale} formatTick={formatXTick} label={xLabel} />
          <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel || "Count"} />
          <Bars
            data={bins}
            keyAccessor={(d, i) => i}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            widthAccessor={widthAccessorScaled}
            heightAccessor={heightAccessorScaled}
            style={barStyle}
            onMouseEnter={handleEnter}
            onMouseMove={handleMove}
            onMouseLeave={hideTooltip}
          />
        </Chart>
      </div>
    </ChartLayout>
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
