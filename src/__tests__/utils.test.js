import { combineChartDimensions, callAccessor, useUniqueId } from '../Utils/utils'
import { renderHook } from '@testing-library/react'

describe('combineChartDimensions', () => {
  it('applies default margins when none provided', () => {
    const result = combineChartDimensions({})
    expect(result.marginTop).toBe(40)
    expect(result.marginRight).toBe(30)
    expect(result.marginBottom).toBe(40)
    expect(result.marginLeft).toBe(75)
  })

  it('computes boundedWidth and boundedHeight from dimensions', () => {
    const result = combineChartDimensions({ width: 500, height: 300 })
    expect(result.boundedWidth).toBe(500 - 75 - 30)  // 395
    expect(result.boundedHeight).toBe(300 - 40 - 40) // 220
  })

  it('overrides default margins with provided values', () => {
    const result = combineChartDimensions({ marginTop: 10, marginLeft: 20 })
    expect(result.marginTop).toBe(10)
    expect(result.marginLeft).toBe(20)
    // other defaults still apply
    expect(result.marginRight).toBe(30)
    expect(result.marginBottom).toBe(40)
  })

  it('clamps boundedWidth and boundedHeight to 0 when margins exceed dimensions', () => {
    const result = combineChartDimensions({ width: 10, height: 10 })
    expect(result.boundedWidth).toBe(0)
    expect(result.boundedHeight).toBe(0)
  })

  it('passes through extra properties unchanged', () => {
    const result = combineChartDimensions({ width: 400, height: 300, custom: 'value' })
    expect(result.custom).toBe('value')
  })
})

describe('callAccessor', () => {
  it('calls a function accessor with data and index', () => {
    const accessor = jest.fn().mockReturnValue(42)
    const result = callAccessor(accessor, { x: 5 }, 3)
    expect(result).toBe(42)
    expect(accessor).toHaveBeenCalledWith({ x: 5 }, 3)
  })

  it('returns a numeric accessor directly without calling it', () => {
    expect(callAccessor(0, { x: 5 }, 0)).toBe(0)
    expect(callAccessor(99, { x: 5 }, 0)).toBe(99)
  })
})

describe('useUniqueId', () => {
  it('returns a string containing the prefix', () => {
    const { result } = renderHook(() => useUniqueId('myprefix'))
    expect(result.current).toMatch(/^myprefix-\d+$/)
  })

  it('generates unique IDs across separate calls', () => {
    const { result: r1 } = renderHook(() => useUniqueId('prefix'))
    const { result: r2 } = renderHook(() => useUniqueId('prefix'))
    expect(r1.current).not.toBe(r2.current)
  })

  it('uses an empty string prefix when none is provided', () => {
    const { result } = renderHook(() => useUniqueId())
    expect(result.current).toMatch(/^-\d+$/)
  })
})
