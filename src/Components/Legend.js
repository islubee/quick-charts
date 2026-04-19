import React from "react"
import PropTypes from "prop-types"

const Legend = ({ items, position }) => {
  const isVertical = position === 'left' || position === 'right'
  return (
    <div
      className="Legend"
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px 14px',
        padding: isVertical ? '0 10px' : '6px 8px',
        fontSize: '12px',
        color: '#555',
        flexShrink: 0,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="Legend__item"
          style={{ display: 'flex', alignItems: 'center', gap: 5 }}
        >
          <span
            className="Legend__swatch"
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 2,
              background: item.color,
              flexShrink: 0,
            }}
          />
          <span className="Legend__label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

Legend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

Legend.defaultProps = {
  items: [],
  position: 'bottom',
}

export default Legend
