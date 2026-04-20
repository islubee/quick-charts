import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Axis from "../Cartesian/Axis"
import ChartLayout from "../Components/ChartLayout"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"
import { useTooltip } from "../Utils/useTooltip"

const fmt = d3.format(",")

const StackedBarChart = ({
  data, xAccessor, keys, colors,
  xLabel, yLabel, barPadding, formatYTick,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const { wrapperRef, tooltip, showTooltip, moveTooltip, hideTooltip } = useTooltip()

  const colorScale = useMemo(() =>
    d3.scaleOrdinal(Array.isArray(colors) ? colors : d3.schemeSet2).domain(keys),
    [colors, keys]
  )

  const series = useMemo(() =>
    data && keys && keys.length ? d3.stack().keys(keys)(data) : [],
    [data, keys]
  )

  const xScale = useMemo(() =>
    d3.scaleBand()
      .domain(data ? data.map(xAccessor) : [])
      .range([0, dimensions.boundedWidth])
      .padding(barPadding ?? 0.2),
    [data, xAccessor, dimensions.boundedWidth, barPadding]
  )

  const yScale = useMemo(() =>
    d3.scaleLinear()
      .domain([0, d3.max(series, s => d3.max(s, d => d[1])) || 0])
      .range([dimensions.boundedHeight, 0])
      .nice(),
    [series, dimensions.boundedHeight]
  )

  const legendItems = useMemo(() =>
    keys.map(k => ({ color: colorScale(k), label: k })),
    [keys, colorScale]
  )

  const handleEnter = useCallback((key, d, e) => {
    const total = keys.reduce((sum, k) => sum + (d.data[k] || 0), 0)
    showTooltip(e, { key, value: d[1] - d[0], category: xAccessor(d.data), total })
  }, [showTooltip, keys, xAccessor])

  const handleMove = useCallback((key, d, e) => moveTooltip(e), [moveTooltip])

  if (!data || data.length === 0 || !keys || keys.length === 0) return null

  return (
    <ChartLayout wrapperRef={wrapperRef} legendItems={legendItems} showLegend={showLegend} legendPosition={legendPosition} tooltip={
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.key && (
          <>
            <div><strong>{tooltip.category}</strong></div>
            <div>{tooltip.key}: {fmt(tooltip.value)}</div>
            <div style={{ color: '#888', fontSize: 11 }}>Total: {fmt(tooltip.total)}</div>
          </>
        )}
      </Tooltip>
    }>
      <div className="StackedBarChart" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
          <Axis dimension="x" scale={xScale} formatTick={d => d} label={xLabel} />
          <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel} />
          {series.map(s => (
            <g key={s.key} className="StackedBar__series">
              {s.map((d, i) => (
                <rect
                  key={`${s.key}-${i}`}
                  className="StackedBar__segment"
                  x={xScale(xAccessor(d.data))}
                  y={yScale(d[1])}
                  width={xScale.bandwidth()}
                  height={Math.max(0, yScale(d[0]) - yScale(d[1]))}
                  style={{ fill: colorScale(s.key) }}
                  onMouseEnter={e => handleEnter(s.key, d, e)}
                  onMouseMove={e => handleMove(s.key, d, e)}
                  onMouseLeave={hideTooltip}
                />
              ))}
            </g>
          ))}
        </Chart>
      </div>
    </ChartLayout>
  )
}

StackedBarChart.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
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
  showLegend: true,
}

export default StackedBarChart
