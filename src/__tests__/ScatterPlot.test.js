import React from 'react'
import { render } from '@testing-library/react'
import ScatterPlot from '../Charts/ScatterPlot'

const makeData = (n = 20) =>
  Array.from({ length: n }, (_, i) => ({
    humidity: 0.3 + i * 0.02,
    temperature: 55 + i * 2,
  }))

describe('ScatterPlot', () => {
  it('renders without crashing', () => {
    const data = makeData()
    const { container } = render(
      <ScatterPlot
        data={data}
        xAccessor={(d) => d.humidity}
        yAccessor={(d) => d.temperature}
        xLabel="Humidity"
        yLabel="Temperature"
      />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('wraps content in a div with class "ScatterPlot"', () => {
    const { container } = render(
      <ScatterPlot
        data={makeData()}
        xAccessor={(d) => d.humidity}
        yAccessor={(d) => d.temperature}
      />
    )
    expect(container.querySelector('.ScatterPlot')).toBeInTheDocument()
  })

  it('renders an SVG chart', () => {
    const { container } = render(
      <ScatterPlot
        data={makeData()}
        xAccessor={(d) => d.humidity}
        yAccessor={(d) => d.temperature}
      />
    )
    expect(container.querySelector('svg.Chart')).toBeInTheDocument()
  })

  it('renders one circle per data point', () => {
    const data = makeData(5)
    const { container } = render(
      <ScatterPlot
        data={data}
        xAccessor={(d) => d.humidity}
        yAccessor={(d) => d.temperature}
      />
    )
    expect(container.querySelectorAll('circle')).toHaveLength(5)
  })

  it('uses default accessors when none are supplied', () => {
    const defaultData = makeData().map((d, i) => ({ x: d.humidity, y: d.temperature }))
    expect(() =>
      render(<ScatterPlot data={defaultData} />)
    ).not.toThrow()
  })
})
