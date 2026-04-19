import React, { useRef, useState } from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Circles from "../Components/Circles"
import Axis from "../Cartesian/Axis"
import Legend from "../Components/Legend"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"

const DEFAULT_COLOR = '#9980FA'
const fmt = d3.format(",")

const ScatterPlot = ({
  data, xAccessor, yAccessor, xLabel, yLabel,
  color, radius, formatXTick, formatYTick,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const wrapperRef = useRef()
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, d: null })

  if (!data || data.length === 0) return null

  const xExtent = d3.extent(data, xAccessor)
  const yExtent = d3.extent(data, yAccessor)

  const xDomain = xExtent[0] === xExtent[1]
    ? [xExtent[0] - 1, xExtent[0] + 1]
    : xExtent
  const yDomain = yExtent[0] === yExtent[1]
    ? [yExtent[0] - 1, yExtent[0] + 1]
    : yExtent

  const xScale = d3.scaleLinear().domain(xDomain).range([0, dimensions.boundedWidth]).nice()
  const yScale = d3.scaleLinear().domain(yDomain).range([dimensions.boundedHeight, 0]).nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  const getPos = e => {
    const { left, top } = wrapperRef.current.getBoundingClientRect()
    return { x: e.clientX - left, y: e.clientY - top }
  }

  const handleEnter = (d, i, e) => {
    const { x, y } = getPos(e)
    setTooltip({ visible: true, x, y, d })
  }
  const handleMove = (d, i, e) => {
    const { x, y } = getPos(e)
    setTooltip(t => ({ ...t, x, y }))
  }
  const handleLeave = () => setTooltip(t => ({ ...t, visible: false }))

  const legendItems = yLabel
    ? [{ color: color || DEFAULT_COLOR, label: yLabel }]
    : []
  const resolvedPosition = legendPosition || 'bottom'
  const isHorizontal = resolvedPosition === 'left' || resolvedPosition === 'right'
  const isLeading = resolvedPosition === 'top' || resolvedPosition === 'left'

  const chart = (
    <div className="ScatterPlot" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
        <Axis dimension="x" scale={xScale} formatTick={formatXTick} label={xLabel} />
        <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel} />
        <Circles
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          radius={radius}
          color={color}
          onMouseEnter={handleEnter}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        />
      </Chart>
    </div>
  )

  const legend = showLegend && legendItems.length > 0
    ? <Legend items={legendItems} position={resolvedPosition} />
    : null

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: isHorizontal ? 'row' : 'column', position: 'relative' }}>
      {isLeading && legend}
      {chart}
      {!isLeading && legend}
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.d && (
          <>
            <div><strong>{xLabel || 'X'}</strong>: {fmt(xAccessor(tooltip.d))}</div>
            <div><strong>{yLabel || 'Y'}</strong>: {fmt(yAccessor(tooltip.d))}</div>
          </>
        )}
      </Tooltip>
    </div>
  )
}

ScatterPlot.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  color: PropTypes.string,
  radius: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  formatXTick: PropTypes.func,
  formatYTick: PropTypes.func,
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

ScatterPlot.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
}

export default ScatterPlot
