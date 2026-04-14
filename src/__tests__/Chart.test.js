import React from 'react'
import { render } from '@testing-library/react'
import Chart, { useDimensionsContext } from '../Components/Chart'

const dimensions = {
  width: 600,
  height: 400,
  marginTop: 40,
  marginRight: 30,
  marginBottom: 40,
  marginLeft: 75,
  boundedWidth: 495,
  boundedHeight: 320,
}

describe('Chart', () => {
  it('renders an SVG with the provided width and height', () => {
    const { container } = render(<Chart dimensions={dimensions} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '600')
    expect(svg).toHaveAttribute('height', '400')
  })

  it('applies the Chart CSS class to the SVG', () => {
    const { container } = render(<Chart dimensions={dimensions} />)
    expect(container.querySelector('.Chart')).toBeInTheDocument()
  })

  it('translates the inner <g> by the left and top margins', () => {
    const { container } = render(<Chart dimensions={dimensions} />)
    const g = container.querySelector('g')
    expect(g).toHaveAttribute('transform', 'translate(75, 40)')
  })

  it('renders children inside the SVG', () => {
    const { getByText } = render(
      <Chart dimensions={dimensions}>
        <text>hello</text>
      </Chart>
    )
    expect(getByText('hello')).toBeInTheDocument()
  })

  it('renders without crashing when no dimensions are supplied', () => {
    const { container } = render(<Chart />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
