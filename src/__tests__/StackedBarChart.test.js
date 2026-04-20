import React from 'react'
import { render } from '@testing-library/react'
import StackedBarChart from '../Charts/StackedBarChart'

const keys = ['apples', 'oranges', 'bananas']

const makeData = () => [
  { month: 'Jan', apples: 30, oranges: 20, bananas: 15 },
  { month: 'Feb', apples: 25, oranges: 30, bananas: 10 },
  { month: 'Mar', apples: 40, oranges: 15, bananas: 20 },
  { month: 'Apr', apples: 35, oranges: 25, bananas: 18 },
]

const baseProps = {
  data: makeData(),
  xAccessor: d => d.month,
  keys,
}

describe('StackedBarChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<StackedBarChart {...baseProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders a .StackedBarChart container', () => {
    const { container } = render(<StackedBarChart {...baseProps} />)
    expect(container.querySelector('.StackedBarChart')).toBeInTheDocument()
  })

  it('renders an SVG chart', () => {
    const { container } = render(<StackedBarChart {...baseProps} />)
    expect(container.querySelector('svg.Chart')).toBeInTheDocument()
  })

  it('renders one segment per datum per key', () => {
    const data = makeData()
    const { container } = render(<StackedBarChart {...baseProps} data={data} />)
    expect(container.querySelectorAll('.StackedBar__segment')).toHaveLength(data.length * keys.length)
  })

  it('renders one series group per key', () => {
    const { container } = render(<StackedBarChart {...baseProps} />)
    expect(container.querySelectorAll('.StackedBar__series')).toHaveLength(keys.length)
  })

  it('renders x and y axes', () => {
    const { container } = render(<StackedBarChart {...baseProps} />)
    expect(container.querySelector('.AxisHorizontal')).toBeInTheDocument()
    expect(container.querySelector('.AxisVertical')).toBeInTheDocument()
  })

  it('renders nothing for empty data', () => {
    const { container } = render(<StackedBarChart data={[]} keys={keys} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when keys is empty', () => {
    const { container } = render(<StackedBarChart data={makeData()} keys={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows a legend by default', () => {
    const { container } = render(<StackedBarChart {...baseProps} />)
    expect(container.querySelector('.Legend')).toBeInTheDocument()
  })

  it('legend has one item per key', () => {
    const { container } = render(<StackedBarChart {...baseProps} />)
    expect(container.querySelectorAll('.Legend__item')).toHaveLength(keys.length)
  })

  it('hides legend when showLegend is false', () => {
    const { container } = render(<StackedBarChart {...baseProps} showLegend={false} />)
    expect(container.querySelector('.Legend')).not.toBeInTheDocument()
  })

  it('uses default xAccessor (d => d.x)', () => {
    const defaultData = makeData().map(d => ({ x: d.month, ...d }))
    expect(() => render(<StackedBarChart data={defaultData} keys={keys} />)).not.toThrow()
  })
})
