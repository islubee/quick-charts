import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { scaleOrdinal } from 'd3-scale'
import { arc, pie } from 'd3-shape'
import { sum } from 'd3-array'
import { schemeSet2 } from 'd3-scale-chromatic'
import { format } from 'd3-format'

import Chart from "../Components/Chart"
import ChartLayout from "../Components/ChartLayout"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"
import { useTooltip } from "../Utils/useTooltip"

const DEFAULT_MARGIN = { marginTop: 20, marginRight: 20, marginBottom: 20, marginLeft: 20 }
const MIN_LABEL_ANGLE = 0.35
const fmt = format(",")

const PieChart = ({
  data, valueAccessor, labelAccessor,
  colors, innerRadius, padAngle, showLabels,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions(DEFAULT_MARGIN)
  const { wrapperRef, tooltip, showTooltip, moveTooltip, hideTooltip } = useTooltip()

  const colorScale = useMemo(() =>
    scaleOrdinal(Array.isArray(colors) ? colors : schemeSet2),
    [colors]
  )

  const outerRadius = Math.min(dimensions.boundedWidth, dimensions.boundedHeight) / 2
  const cx = dimensions.boundedWidth / 2
  const cy = dimensions.boundedHeight / 2

  const resolvedInnerRadius = typeof innerRadius === 'number'
    ? outerRadius * Math.min(Math.max(innerRadius, 0), 0.95)
    : 0

  const arcGenerator = useMemo(() =>
    arc().innerRadius(resolvedInnerRadius).outerRadius(outerRadius),
    [resolvedInnerRadius, outerRadius]
  )

  const labelArc = useMemo(() => {
    const r = resolvedInnerRadius > 0
      ? (resolvedInnerRadius + outerRadius) / 2
      : outerRadius * 0.65
    return arc().innerRadius(r).outerRadius(r)
  }, [resolvedInnerRadius, outerRadius])

  const arcs = useMemo(() =>
    data ? pie()
      .value(valueAccessor)
      .padAngle(padAngle ?? 0.02)
      .sort(null)(data)
    : [],
    [data, valueAccessor, padAngle]
  )

  const total = useMemo(() =>
    data ? sum(data, valueAccessor) : 0,
    [data, valueAccessor]
  )

  const legendItems = useMemo(() =>
    typeof labelAccessor === 'function'
      ? (data || []).map((d, i) => {
          const label = labelAccessor(d)
          return { color: colorScale(label !== undefined ? label : String(i)), label: String(label) }
        })
      : [],
    [data, labelAccessor, colorScale]
  )

  const handleSliceEnter = useCallback((datum, label, e) =>
    showTooltip(e, { datum, label }),
    [showTooltip]
  )
  const handleSliceMove = useCallback((datum, label, e) => moveTooltip(e), [moveTooltip])

  if (!data || data.length === 0) return null

  const displayLabels = showLabels !== false && typeof labelAccessor === 'function'
  const tooltipValue = tooltip.datum ? valueAccessor(tooltip.datum) : 0
  const tooltipPct = total > 0 ? Math.round(tooltipValue / total * 100) : 0

  return (
    <ChartLayout wrapperRef={wrapperRef} legendItems={legendItems} showLegend={showLegend} legendPosition={legendPosition} tooltip={
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.datum && (
          <>
            <div><strong>{tooltip.label}</strong></div>
            <div>{fmt(tooltipValue)} ({tooltipPct}%)</div>
          </>
        )}
      </Tooltip>
    }>
      <div className="PieChart" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Chart dimensions={dimensions} label="Pie chart">
          <g transform={`translate(${cx}, ${cy})`}>
            {arcs.map((a, i) => {
              const label = labelAccessor ? labelAccessor(data[i]) : String(i)
              return (
                <g key={i} className="PieChart__slice-group">
                  <path
                    className="PieChart__slice"
                    d={arcGenerator(a)}
                    style={{ fill: colorScale(label) }}
                    onMouseEnter={e => handleSliceEnter(data[i], label, e)}
                    onMouseMove={e => handleSliceMove(data[i], label, e)}
                    onMouseLeave={hideTooltip}
                  />
                  {displayLabels && (a.endAngle - a.startAngle) >= MIN_LABEL_ANGLE && (
                    <text
                      className="PieChart__label"
                      transform={`translate(${labelArc.centroid(a)})`}
                      style={{ textAnchor: 'middle', dominantBaseline: 'middle', pointerEvents: 'none' }}
                    >
                      {label}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </Chart>
      </div>
    </ChartLayout>
  )
}

PieChart.propTypes = {
  data: PropTypes.array,
  valueAccessor: accessorPropsType,
  labelAccessor: accessorPropsType,
  colors: PropTypes.arrayOf(PropTypes.string),
  innerRadius: PropTypes.number,
  padAngle: PropTypes.number,
  showLabels: PropTypes.bool,
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

PieChart.defaultProps = {
  valueAccessor: d => d.value,
  labelAccessor: d => d.label,
}

export default PieChart
