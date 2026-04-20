import React, { useRef, useState } from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Axis from "../Cartesian/Axis"
import Legend from "../Components/Legend"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"

const fmt = d3.format(",")

const StackedBarChart = ({
  data, xAccessor, keys, colors,
  xLabel, yLabel, barPadding, formatYTick,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const wrapperRef = useRef()
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, key: null, value: 0, category: null, total: 0 })

  if (!data || data.length === 0 || !keys || keys.length === 0) return null

  const colorScale = d3.scaleOrdinal(Array.isArray(colors) ? colors : d3.schemeSet2).domain(keys)

  const series = d3.stack().keys(keys)(data)

  const xScale = d3.scaleBand()
    .domain(data.map(xAccessor))
    .range([0, dimensions.boundedWidth])
    .padding(barPadding !== undefined ? barPadding : 0.2)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(series, s => d3.max(s, d => d[1]))])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const getPos = e => {
    const { left, top } = wrapperRef.current.getBoundingClientRect()
    return { x: e.clientX - left, y: e.clientY - top }
  }

  const handleEnter = (key, d, e) => {
    const { x, y } = getPos(e)
    const total = keys.reduce((sum, k) => sum + (d.data[k] || 0), 0)
    setTooltip({ visible: true, x, y, key, value: d[1] - d[0], category: xAccessor(d.data), total })
  }
  const handleMove = (key, d, e) => {
    const { x, y } = getPos(e)
    setTooltip(t => ({ ...t, x, y }))
  }
  const handleLeave = () => setTooltip(t => ({ ...t, visible: false }))

  const legendItems = keys.map(k => ({ color: colorScale(k), label: k }))
  const resolvedPosition = legendPosition || 'bottom'
  const isHorizontal = resolvedPosition === 'left' || resolvedPosition === 'right'
  const isLeading = resolvedPosition === 'top' || resolvedPosition === 'left'

  const chart = (
    <div className="StackedBarChart" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
        <Axis dimension="x" scale={xScale} formatTick={d => d} label={xLabel} />
        <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel} />
        {series.map(s => (
          <g key={s.key} className="StackedBar__series">
            {s.map((d, i) => (
              <rect
                key={i}
                className="StackedBar__segment"
                x={xScale(xAccessor(d.data))}
                y={yScale(d[1])}
                width={xScale.bandwidth()}
                height={Math.max(0, yScale(d[0]) - yScale(d[1]))}
                style={{ fill: colorScale(s.key) }}
                onMouseEnter={e => handleEnter(s.key, d, e)}
                onMouseMove={e => handleMove(s.key, d, e)}
                onMouseLeave={handleLeave}
              />
            ))}
          </g>
        ))}
      </Chart>
    </div>
  )

  const legend = showLegend !== false && legendItems.length > 0
    ? <Legend items={legendItems} position={resolvedPosition} />
    : null

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: isHorizontal ? 'row' : 'column', position: 'relative' }}>
      {isLeading && legend}
      {chart}
      {!isLeading && legend}
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.key && (
          <>
            <div><strong>{tooltip.category}</strong></div>
            <div>{tooltip.key}: {fmt(tooltip.value)}</div>
            <div style={{ color: '#888', fontSize: 11 }}>Total: {fmt(tooltip.total)}</div>
          </>
        )}
      </Tooltip>
    </div>
  )
}

StackedBarChart.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  /** Series keys to stack — each key must be a numeric property on each datum. Required. */
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  barPadding: PropTypes.number,
  formatYTick: PropTypes.func,
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

StackedBarChart.defaultProps = {
  xAccessor: d => d.x,
}

export default StackedBarChart
