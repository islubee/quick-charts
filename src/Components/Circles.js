import React from "react"
import PropTypes from "prop-types"
import { accessorPropsType } from "../Utils/utils";

const Circles = ({ data, keyAccessor, xAccessor, yAccessor, radius, color, onMouseEnter, onMouseLeave, onMouseMove, ...props }) => (
  <React.Fragment>
    {data.map((d, i) => (
      <circle {...props}
        className="Circles__circle"
        key={keyAccessor(d, i)}
        cx={xAccessor(d, i)}
        cy={yAccessor(d, i)}
        r={typeof radius === "function" ? radius(d) : radius}
        style={color ? { fill: color } : undefined}
        onMouseEnter={onMouseEnter ? e => onMouseEnter(d, i, e) : undefined}
        onMouseLeave={onMouseLeave ? e => onMouseLeave(d, i, e) : undefined}
        onMouseMove={onMouseMove ? e => onMouseMove(d, i, e) : undefined}
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
  color: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
}

Circles.defaultProps = {
  radius: 5,
}

export default Circles
