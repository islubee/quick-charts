import React from 'react'
import { render } from '@testing-library/react'
import PieChart from '../Charts/PieChart'

const makeData = () => [
  { label: 'Apples',  value: 30 },
  { label: 'Bananas', value: 20 },
  { label: 'Cherries', value: 15 },
  { label: 'Dates',   value: 10 },
  { label: 'Elderberries', value: 25 },
]

describe('PieChart', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <PieChart
        data={makeData()}
        valueAccessor={d => d.value}
        labelAccessor={d => d.label}
      />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('wraps content in a div with class "PieChart"', () => {
    const { container } = render(
      <PieChart data={makeData()} valueAccessor={d => d.value} />
    )
    expect(container.querySelector('.PieChart')).toBeInTheDocument()
  })

  it('renders an SVG chart', () => {
    const { container } = render(
      <PieChart data={makeData()} valueAccessor={d => d.value} />
    )
    expect(container.querySelector('svg.Chart')).toBeInTheDocument()
  })

  it('renders one slice per data point', () => {
    const data = makeData()
    const { container } = render(
      <PieChart data={data} valueAccessor={d => d.value} />
    )
    expect(container.querySelectorAll('.PieChart__slice')).toHaveLength(data.length)
  })

  it('renders nothing for empty data', () => {
    const { container } = render(
      <PieChart data={[]} valueAccessor={d => d.value} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders labels when labelAccessor is provided', () => {
    const data = makeData()
    const { container } = render(
      <PieChart
        data={data}
        valueAccessor={d => d.value}
        labelAccessor={d => d.label}
      />
    )
    expect(container.querySelectorAll('.PieChart__label')).toHaveLength(data.length)
  })

  it('hides labels when showLabels is false', () => {
    const { container } = render(
      <PieChart
        data={makeData()}
        valueAccessor={d => d.value}
        labelAccessor={d => d.label}
        showLabels={false}
      />
    )
    expect(container.querySelector('.PieChart__label')).toBeNull()
  })

  it('uses default accessors when none are supplied', () => {
    const defaultData = makeData().map(d => ({ label: d.label, value: d.value }))
    expect(() => render(<PieChart data={defaultData} />)).not.toThrow()
  })

  it('renders a donut when innerRadius is provided', () => {
    const { container } = render(
      <PieChart
        data={makeData()}
        valueAccessor={d => d.value}
        innerRadius={0.5}
      />
    )
    // All slices should still render
    expect(container.querySelectorAll('.PieChart__slice')).toHaveLength(makeData().length)
  })
})
