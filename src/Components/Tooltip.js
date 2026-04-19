import React from 'react'
import PropTypes from 'prop-types'

const Tooltip = ({ visible, x, y, children }) => {
  if (!visible) return null
  return (
    <div
      className="Tooltip"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, calc(-100% - 10px))',
        pointerEvents: 'none',
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 6,
        padding: '7px 12px',
        fontSize: 12,
        lineHeight: 1.6,
        boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        zIndex: 10,
        whiteSpace: 'nowrap',
        color: '#444',
      }}
    >
      {children}
    </div>
  )
}

Tooltip.propTypes = {
  visible: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  children: PropTypes.node,
}

export default Tooltip
