import React from 'react'
import { render } from '@testing-library/react'
import BarChart from '../Charts/BarChart'

const makeData = () => [
  { category: 'Mon', value: 12 },
  { category: 'Tue', value: 8 },
  { category: 'Wed', value: 15 },
  { category: 'Thu', value: 6 },
  { category: 'Fri', value: 20 },
]

describe('BarChart', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <BarChart
        data={makeData()}
        xAccessor={d => d.category}
        yAccessor={d => d.value}
        xLabel="Day"
        yLabel="Sales"
      />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('wraps content in a div with class "BarChart"', () => {
    const { container } = render(
      <BarChart
        data={makeData()}
        xAccessor={d => d.category}
        yAccessor={d => d.value}
      />
    )
    expect(container.querySelector('.BarChart')).toBeInTheDocument()
  })

  it('renders an SVG chart', () => {
    const { container } = render(
      <BarChart
        data={makeData()}
        xAccessor={d => d.category}
        yAccessor={d => d.value}
      />
    )
    expect(container.querySelector('svg.Chart')).toBeInTheDocument()
  })

  it('renders one rect per data point', () => {
    const data = makeData()
    const { container } = render(
      <BarChart
        data={data}
        xAccessor={d => d.category}
        yAccessor={d => d.value}
      />
    )
    expect(container.querySelectorAll('.Bars__rect')).toHaveLength(data.length)
  })

  it('renders nothing for empty data', () => {
    const { container } = render(
      <BarChart data={[]} xAccessor={d => d.category} yAccessor={d => d.value} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('uses default accessors when none are supplied', () => {
    const defaultData = makeData().map(d => ({ x: d.category, y: d.value }))
    expect(() =>
      render(<BarChart data={defaultData} />)
    ).not.toThrow()
  })

  it('renders x and y axis elements', () => {
    const { container } = render(
      <BarChart
        data={makeData()}
        xAccessor={d => d.category}
        yAccessor={d => d.value}
      />
    )
    expect(container.querySelector('.AxisHorizontal')).toBeInTheDocument()
    expect(container.querySelector('.AxisVertical')).toBeInTheDocument()
  })
})
