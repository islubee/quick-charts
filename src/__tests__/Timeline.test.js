import React from 'react'
import { render } from '@testing-library/react'
import Timeline from '../Charts/Timeline'

const makeData = (n = 15) =>
  Array.from({ length: n }, (_, i) => ({
    date: new Date(2024, 0, i + 1),
    temperature: 60 + i * 2,
  }))

describe('Timeline', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Timeline
        data={makeData()}
        xAccessor={(d) => d.date}
        yAccessor={(d) => d.temperature}
        yLabel="Temperature"
      />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('wraps content in a div with class "Timeline"', () => {
    const { container } = render(
      <Timeline
        data={makeData()}
        xAccessor={(d) => d.date}
        yAccessor={(d) => d.temperature}
      />
    )
    expect(container.querySelector('.Timeline')).toBeInTheDocument()
  })

  it('renders an SVG chart', () => {
    const { container } = render(
      <Timeline
        data={makeData()}
        xAccessor={(d) => d.date}
        yAccessor={(d) => d.temperature}
      />
    )
    expect(container.querySelector('svg.Chart')).toBeInTheDocument()
  })

  it('renders an area path and a line path', () => {
    const { container } = render(
      <Timeline
        data={makeData()}
        xAccessor={(d) => d.date}
        yAccessor={(d) => d.temperature}
      />
    )
    expect(container.querySelector('.Line--type-area')).toBeInTheDocument()
    expect(container.querySelector('.Line--type-line')).toBeInTheDocument()
  })

  it('renders a gradient <defs> element', () => {
    const { container } = render(
      <Timeline
        data={makeData()}
        xAccessor={(d) => d.date}
        yAccessor={(d) => d.temperature}
      />
    )
    expect(container.querySelector('defs')).toBeInTheDocument()
  })

  it('renders nothing for empty data', () => {
    const { container } = render(
      <Timeline data={[]} xAccessor={(d) => d.date} yAccessor={(d) => d.temperature} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('uses default accessors when none are supplied', () => {
    const defaultData = makeData().map((d, i) => ({ x: i, y: d.temperature }))
    expect(() =>
      render(<Timeline data={defaultData} yLabel="Test" />)
    ).not.toThrow()
  })
})
