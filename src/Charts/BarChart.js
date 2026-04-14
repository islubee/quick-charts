import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Bars from "../Components/Bars"
import Axis from "../Cartesian/Axis"
import { useChartDimensions, accessorPropsType } from "../Utils/utils"

const BarChart = ({ data, xAccessor, yAccessor, xLabel, yLabel }) => {
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  if (!data || data.length === 0) return null

  const xScale = d3.scaleBand()
    .domain(data.map(xAccessor))
    .range([0, dimensions.boundedWidth])
    .padding(0.2)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const widthAccessorScaled = () => xScale.bandwidth()
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  return (
    <div className="BarChart" ref={ref}>
      <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
        <Axis
          dimension="x"
          scale={xScale}
          formatTick={d => d}
          label={xLabel}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={yLabel}
        />
        <Bars
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
        />
      </Chart>
    </div>
  )
}

BarChart.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
}

BarChart.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
}

export default BarChart
