import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../Components/Chart"
import Bars from "../Components/Bars"
import Axis from "../Cartesian/Axis"
import Gradient from "../Components/Gradient"
import { useChartDimensions, accessorPropsType, useUniqueId } from "../Utils/utils";

const gradientColors = ["#9980FA", "rgb(226, 222, 243)"]

const Histogram = ({ data, xAccessor, xLabel, yLabel }) => {
  const gradientId = useUniqueId("Histogram-gradient")
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  })

  if (!data || data.length === 0) return null

  const numberOfThresholds = 9

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice(numberOfThresholds)

  const binsGenerator = d3
    .histogram()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds))

  const bins = binsGenerator(data)

  const yAccessor = d => d.length
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const barPadding = 2

  const xAccessorScaled = d => xScale(d.x0) + barPadding
  const yAccessorScaled = d => yScale(yAccessor(d))
  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0) - barPadding
  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  return (
    <div className="Histogram" ref={ref}>
      <Chart dimensions={dimensions} label={[xLabel, yLabel].filter(Boolean).join(' / ')}>
        <defs>
          <Gradient
            id={gradientId}
            colors={gradientColors}
            x2="0"
            y2="100%"
          />
        </defs>
        <Axis
          dimension="x"
          scale={xScale}
          label={xLabel}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={yLabel || "Count"}
        />
        <Bars
          data={bins}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          style={{fill: `url(#${gradientId})`}}
        />
      </Chart>
    </div>
  )
}

Histogram.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
}

Histogram.defaultProps = {
  xAccessor: d => d.x,
}

export default Histogram
