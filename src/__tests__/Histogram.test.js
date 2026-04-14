import React from 'react'
import { render } from '@testing-library/react'
import Histogram from '../Charts/Histogram'

// Spread values across a range wide enough that D3's bin generator produces multiple bins
const makeData = (n = 30) =>
  Array.from({ length: n }, (_, i) => ({
    humidity: 0.2 + (i / n) * 0.6,
  }))

describe('Histogram', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Histogram
        data={makeData()}
        xAccessor={(d) => d.humidity}
        label="Humidity"
      />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('wraps content in a div with class "Histogram"', () => {
    const { container } = render(
      <Histogram
        data={makeData()}
        xAccessor={(d) => d.humidity}
        label="Humidity"
      />
    )
    expect(container.querySelector('.Histogram')).toBeInTheDocument()
  })

  it('renders an SVG chart', () => {
    const { container } = render(
      <Histogram
        data={makeData()}
        xAccessor={(d) => d.humidity}
      />
    )
    expect(container.querySelector('svg.Chart')).toBeInTheDocument()
  })

  it('renders bar rects for the histogram bins', () => {
    const { container } = render(
      <Histogram
        data={makeData()}
        xAccessor={(d) => d.humidity}
      />
    )
    // D3 histogram with 9 thresholds over [0.2, 0.8] produces ~9 bins
    expect(container.querySelectorAll('.Bars__rect').length).toBeGreaterThan(0)
  })

  it('renders a gradient <defs> element', () => {
    const { container } = render(
      <Histogram
        data={makeData()}
        xAccessor={(d) => d.humidity}
      />
    )
    expect(container.querySelector('defs')).toBeInTheDocument()
  })

  it('uses the default x-accessor when none is supplied', () => {
    const defaultData = makeData().map((d) => ({ x: d.humidity }))
    expect(() =>
      render(<Histogram data={defaultData} label="X" />)
    ).not.toThrow()
  })
})
