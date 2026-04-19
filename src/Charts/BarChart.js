import React, { useRef, useState } from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Bars from "../Components/Bars"
import Axis from "../Cartesian/Axis"
import Legend from "../Components/Legend"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"

const DEFAULT_COLOR = '#9980FA'
const fmt = d3.format(",")

const BarChart = ({
  data, xAccessor, yAccessor, xLabel, yLabel,
  color, barPadding, formatYTick, yMin,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const wrapperRef = useRef()
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, d: null })

  if (!data || data.length === 0) return null

  const xScale = d3.scaleBand()
    .domain(data.map(xAccessor))
    .range([0, dimensions.boundedWidth])
    .padding(barPadding !== undefined ? barPadding : 0.2)

  const yScale = d3.scaleLinear()
    .domain([yMin !== undefined ? yMin : 0, d3.max(data, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const widthAccessorScaled = () => xScale.bandwidth()
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessor(d))
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
    <div className="BarChart" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
        <Axis dimension="x" scale={xScale} formatTick={d => d} label={xLabel} />
        <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel} />
        <Bars
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          style={color ? { fill: color } : undefined}
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
            <div><strong>{xLabel || 'Category'}</strong>: {xAccessor(tooltip.d)}</div>
            <div><strong>{yLabel || 'Value'}</strong>: {fmt(yAccessor(tooltip.d))}</div>
          </>
        )}
      </Tooltip>
    </div>
  )
}

BarChart.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  color: PropTypes.string,
  barPadding: PropTypes.number,
  formatYTick: PropTypes.func,
  yMin: PropTypes.number,
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

BarChart.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
}

export default BarChart
