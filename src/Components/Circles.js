import React from "react"
import PropTypes from "prop-types"
import { accessorPropsType } from "../Utils/utils";

const Circles = ({ data, keyAccessor, xAccessor, yAccessor, radius, color }) => (
  <React.Fragment>
    {data.map((d, i) => (
      <circle
        className="Circles__circle"
        key={keyAccessor(d, i)}
        cx={xAccessor(d, i)}
        cy={yAccessor(d, i)}
        r={typeof radius === "function" ? radius(d) : radius}
        style={color ? { fill: color } : undefined}
      />
    ))}
  </React.Fragment>
)

Circles.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  radius: accessorPropsType,
  /** Fill color for each circle. */
  color: PropTypes.string,
}

Circles.defaultProps = {
  radius: 5,
}

export default Circles
