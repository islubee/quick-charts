import React from 'react'
import PropTypes from 'prop-types'
import Legend from './Legend'

const COL_STYLE = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }
const ROW_STYLE = { width: '100%', height: '100%', display: 'flex', flexDirection: 'row', position: 'relative' }

const ChartLayout = ({ wrapperRef, legendItems, showLegend, legendPosition, tooltip, children }) => {
  const position = legendPosition || 'bottom'
  const isHorizontal = position === 'left' || position === 'right'
  const isLeading = position === 'top' || position === 'left'

  const legend = showLegend && legendItems && legendItems.length > 0
    ? <Legend items={legendItems} position={position} />
    : null

  return (
    <div ref={wrapperRef} style={isHorizontal ? ROW_STYLE : COL_STYLE}>
      {isLeading && legend}
      {children}
      {!isLeading && legend}
      {tooltip}
    </div>
  )
}

ChartLayout.propTypes = {
  wrapperRef: PropTypes.object,
  legendItems: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  tooltip: PropTypes.node,
  children: PropTypes.node,
}

export default ChartLayout
