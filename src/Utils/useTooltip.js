import { useRef, useState, useCallback } from 'react'

export function useTooltip() {
  const wrapperRef = useRef()
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 })

  const showTooltip = useCallback((e, data) => {
    const { left, top } = wrapperRef.current.getBoundingClientRect()
    setTooltip({ visible: true, x: e.clientX - left, y: e.clientY - top, ...data })
  }, [])

  const moveTooltip = useCallback(e => {
    const { left, top } = wrapperRef.current.getBoundingClientRect()
    setTooltip(t => ({ ...t, x: e.clientX - left, y: e.clientY - top }))
  }, [])

  const hideTooltip = useCallback(() => {
    setTooltip(t => ({ ...t, visible: false }))
  }, [])

  return { wrapperRef, tooltip, showTooltip, moveTooltip, hideTooltip }
}
