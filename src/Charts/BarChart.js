import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { scaleBand, scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { format } from 'd3-format'

import Chart from "../Components/Chart"
import Bars from "../Components/Bars"
import Axis from "../Cartesian/Axis"
import ChartLayout from "../Components/ChartLayout"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"
import { useTooltip } from "../Utils/useTooltip"

const DEFAULT_COLOR = '#9980FA'
const fmt = format(",")

const BarChart = ({
  data, xAccessor, yAccessor, xLabel, yLabel,
  color, barPadding, formatYTick, yMin,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const { wrapperRef, tooltip, showTooltip, moveTooltip, hideTooltip } = useTooltip()

  const xScale = useMemo(() =>
    scaleBand()
      .domain(data ? data.map(xAccessor) : [])
      .range([0, dimensions.boundedWidth])
      .padding(barPadding ?? 0.2),
    [data, xAccessor, dimensions.boundedWidth, barPadding]
  )

  const yScale = useMemo(() =>
    scaleLinear()
      .domain([yMin ?? 0, max(data, yAccessor) || 0])
      .range([dimensions.boundedHeight, 0])
      .nice(),
    [data, yAccessor, dimensions.boundedHeight, yMin]
  )

  const legendItems = useMemo(() =>
    yLabel ? [{ color: color || DEFAULT_COLOR, label: yLabel }] : [],
    [yLabel, color]
  )

  const barStyle = useMemo(() => color ? { fill: color } : undefined, [color])

  const handleEnter = useCallback((d, i, e) => showTooltip(e, { d }), [showTooltip])
  const handleMove = useCallback((d, i, e) => moveTooltip(e), [moveTooltip])

  if (!data || data.length === 0) return null

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const widthAccessorScaled = () => xScale.bandwidth()
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessor(d))

  return (
    <ChartLayout wrapperRef={wrapperRef} legendItems={legendItems} showLegend={showLegend} legendPosition={legendPosition} tooltip={
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.d && (
          <>
            <div><strong>{xLabel || 'Category'}</strong>: {xAccessor(tooltip.d)}</div>
            <div><strong>{yLabel || 'Value'}</strong>: {fmt(yAccessor(tooltip.d))}</div>
          </>
        )}
      </Tooltip>
    }>
      <div className="BarChart" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
          <Axis dimension="x" scale={xScale} formatTick={d => d} label={xLabel} />
          <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel} />
          <Bars
            data={data}
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
