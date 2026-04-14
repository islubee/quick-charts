import React, { createContext, useContext } from "react"
import PropTypes from "prop-types"
import { dimensionsPropsType } from "../Utils/utils";

import "./Chart.css"

const ChartContext = createContext()
export const useDimensionsContext = () => useContext(ChartContext)

const Chart = ({ dimensions, children, label }) => (
  <ChartContext.Provider value={dimensions}>
    <svg
      className="Chart"
      width={dimensions.width}
      height={dimensions.height}
      role="img"
      aria-label={label}
    >
      <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
        { children }
      </g>
    </svg>
  </ChartContext.Provider>
)

Chart.propTypes = {
  dimensions: dimensionsPropsType,
  label: PropTypes.string,
}

Chart.defaultProps = {
  dimensions: {}
}

export default Chart
