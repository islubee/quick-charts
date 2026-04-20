import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Circles from "../Components/Circles"
import Axis from "../Cartesian/Axis"
import ChartLayout from "../Components/ChartLayout"
import Tooltip from "../Components/Tooltip"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"
import { useTooltip } from "../Utils/useTooltip"

const DEFAULT_COLOR = '#9980FA'
const fmt = d3.format(",")

const ScatterPlot = ({
  data, xAccessor, yAccessor, xLabel, yLabel,
  color, radius, formatXTick, formatYTick,
  showLegend, legendPosition,
}) => {
  const [ref, dimensions] = useChartDimensions({ marginBottom: 77 })
  const { wrapperRef, tooltip, showTooltip, moveTooltip, hideTooltip } = useTooltip()

  const xScale = useMemo(() => {
    const extent = d3.extent(data, xAccessor)
    const domain = extent[0] === extent[1] ? [extent[0] - 1, extent[0] + 1] : extent
    return d3.scaleLinear().domain(domain).range([0, dimensions.boundedWidth]).nice()
  }, [data, xAccessor, dimensions.boundedWidth])

  const yScale = useMemo(() => {
    const extent = d3.extent(data, yAccessor)
    const domain = extent[0] === extent[1] ? [extent[0] - 1, extent[0] + 1] : extent
    return d3.scaleLinear().domain(domain).range([dimensions.boundedHeight, 0]).nice()
  }, [data, yAccessor, dimensions.boundedHeight])

  const legendItems = useMemo(() =>
    yLabel ? [{ color: color || DEFAULT_COLOR, label: yLabel }] : [],
    [yLabel, color]
  )

  const handleEnter = useCallback((d, i, e) => showTooltip(e, { d }), [showTooltip])
  const handleMove = useCallback((d, i, e) => moveTooltip(e), [moveTooltip])

  if (!data || data.length === 0) return null

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))

  return (
    <ChartLayout wrapperRef={wrapperRef} legendItems={legendItems} showLegend={showLegend} legendPosition={legendPosition} tooltip={
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.d && (
          <>
            <div><strong>{xLabel || 'X'}</strong>: {fmt(xAccessor(tooltip.d))}</div>
            <div><strong>{yLabel || 'Y'}</strong>: {fmt(yAccessor(tooltip.d))}</div>
          </>
        )}
      </Tooltip>
    }>
      <div className="ScatterPlot" ref={ref} style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
          <Axis dimension="x" scale={xScale} formatTick={formatXTick} label={xLabel} />
          <Axis dimension="y" scale={yScale} formatTick={formatYTick} label={yLabel} />
          <Circles
            data={data}
            keyAccessor={(d, i) => i}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            radius={radius}
            color={color}
            onMouseEnter={handleEnter}
            onMouseMove={handleMove}
            onMouseLeave={hideTooltip}
          />
        </Chart>
      </div>
    </ChartLayout>
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
