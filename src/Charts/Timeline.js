import React, { useCallback, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { scaleTime, scaleLinear } from 'd3-scale'
import { extent, bisector } from 'd3-array'
import { timeFormat } from 'd3-time-format'
import { format } from 'd3-format'

import Chart from "../Components/Chart"
import Line from "../Components/Line"
import Circles from "../Components/Circles"
import Axis from "../Cartesian/Axis"
import Gradient from "../Components/Gradient"
import ChartLayout from "../Components/ChartLayout"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType, useUniqueId } from "../Utils/utils"
import { useTooltip } from "../Utils/useTooltip"

const formatDate = timeFormat("%-b %-d")
const formatTooltipDate = timeFormat("%-b %-d, %Y")
const DEFAULT_GRADIENT = ["rgb(226, 222, 243)", "#f8f9fa"]
const DEFAULT_COLOR = '#9980FA'
const fmt = format(",")

const Timeline = ({
  data, xAccessor, yAccessor, xLabel, yLabel,
  color, gradientColors,
  interpolation, showArea, showDots,
  formatXTick, formatYTick,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const gradientId = useUniqueId("Timeline-gradient")
  const { wrapperRef, tooltip, showTooltip, hideTooltip } = useTooltip()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const resolvedGradientColors = gradientColors
    || (color ? [`${color}55`, "rgba(255,255,255,0)"] : DEFAULT_GRADIENT)

  const xScale = useMemo(() =>
    scaleTime()
      .domain(extent(data, xAccessor))
      .range([0, dimensions.boundedWidth]),
    [data, xAccessor, dimensions.boundedWidth]
  )

  const yScale = useMemo(() =>
    scaleLinear()
      .domain(extent(data, yAccessor))
      .range([dimensions.boundedHeight, 0])
      .nice(),
    [data, yAccessor, dimensions.boundedHeight]
  )

  const legendItems = useMemo(() =>
    yLabel ? [{ color: color || DEFAULT_COLOR, label: yLabel }] : [],
    [yLabel, color]
  )

  const dateBisector = useMemo(() => bisector(xAccessor).left, [xAccessor])

  const handleMouseMove = useCallback(e => {
    const svgEl = e.currentTarget.ownerSVGElement
    const { left: svgLeft } = svgEl.getBoundingClientRect()
    const mouseX = e.clientX - svgLeft - dimensions.marginLeft
    const date = xScale.invert(mouseX)
    const idx = dateBisector(data, date, 1)
    const d0 = data[idx - 1]
    const d1 = data[idx]
    const i = !d1 || (d0 && date - xAccessor(d0) < xAccessor(d1) - date) ? idx - 1 : idx
    setHoveredIndex(i)
    showTooltip(e, { datum: data[i] })
  }, [data, xAccessor, xScale, dateBisector, dimensions.marginLeft, showTooltip])

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
    hideTooltip()
  }, [hideTooltip])

  if (!data || data.length === 0) return null

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const y0AccessorScaled = yScale(yScale.domain()[0])
  const hoveredDatum = hoveredIndex !== null ? data[hoveredIndex] : null
  const yFmt = formatYTick || fmt
  const xFmt = formatXTick || formatTooltipDate

  return (
    <ChartLayout wrapperRef={wrapperRef} legendItems={legendItems} showLegend={showLegend} legendPosition={legendPosition} tooltip={
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.datum && (
          <>
            <div><strong>{xFmt(xAccessor(tooltip.datum))}</strong></div>
            <div>{yLabel || 'Value'}: {yFmt(yAccessor(tooltip.datum))}</div>
          </>
        )}
      </Tooltip>
    }>
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
          {hoveredDatum && (
            <>
              <line
                className="Timeline__hover-line"
                x1={xAccessorScaled(hoveredDatum)}
                x2={xAccessorScaled(hoveredDatum)}
                y1={0}
                y2={dimensions.boundedHeight}
              />
              <circle
                className="Timeline__hover-dot"
                cx={xAccessorScaled(hoveredDatum)}
                cy={yAccessorScaled(hoveredDatum)}
                r={5}
                style={{ stroke: color || DEFAULT_COLOR }}
              />
            </>
          )}
          <rect
            x={0} y={0}
            width={dimensions.boundedWidth}
            height={dimensions.boundedHeight}
            fill="none"
            style={{ pointerEvents: 'all' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </Chart>
      </div>
    </ChartLayout>
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
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

Timeline.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  showArea: true,
  showDots: false,
}

export default Timeline
