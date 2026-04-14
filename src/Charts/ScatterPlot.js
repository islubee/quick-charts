import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Circles from "../Components/Circles"
import Axis from "../Cartesian/Axis"
import { useChartDimensions, accessorPropsType } from "../Utils/utils";

const ScatterPlot = ({ data, xAccessor, yAccessor, xLabel, yLabel }) => {
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  if (!data || data.length === 0) return null

  const xExtent = d3.extent(data, xAccessor)
  const yExtent = d3.extent(data, yAccessor)

  // Expand zero-width domains so a single unique value still renders visibly
  const xDomain = xExtent[0] === xExtent[1]
    ? [xExtent[0] - 1, xExtent[0] + 1]
    : xExtent
  const yDomain = yExtent[0] === yExtent[1]
    ? [yExtent[0] - 1, yExtent[0] + 1]
    : yExtent

  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  return (
    <div className="ScatterPlot" ref={ref}>
      <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
        <Axis
          dimension="x"
          scale={xScale}
          label={xLabel}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={yLabel}
        />
        <Circles
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
        />
      </Chart>
    </div>
  )
}

ScatterPlot.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
}

ScatterPlot.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
}

export default ScatterPlot
