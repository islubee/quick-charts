import React from 'react'
import { render } from '@testing-library/react'
import Line from '../Components/Line'

const data = [
  { x: 0,   y: 10 },
  { x: 50,  y: 30 },
  { x: 100, y: 20 },
]

describe('Line', () => {
  it('renders a <path> element', () => {
    const { container } = render(
      <svg>
        <Line data={data} xAccessor={(d) => d.x} yAccessor={(d) => d.y} />
      </svg>
    )
    expect(container.querySelector('path')).toBeInTheDocument()
  })

  it('defaults to the "line" type and sets the correct class', () => {
    const { container } = render(
      <svg>
        <Line data={data} xAccessor={(d) => d.x} yAccessor={(d) => d.y} />
      </svg>
    )
    expect(container.querySelector('.Line--type-line')).toBeInTheDocument()
  })

  it('sets the area class when type="area"', () => {
    const { container } = render(
      <svg>
        <Line
          type="area"
          data={data}
          xAccessor={(d) => d.x}
          yAccessor={(d) => d.y}
          y0Accessor={0}
        />
      </svg>
    )
    expect(container.querySelector('.Line--type-area')).toBeInTheDocument()
  })

  it('always adds the base Line class', () => {
    const { container } = render(
      <svg>
        <Line data={data} xAccessor={(d) => d.x} yAccessor={(d) => d.y} />
      </svg>
    )
    expect(container.querySelector('.Line')).toBeInTheDocument()
  })

  it('the path has a non-empty d attribute for valid data', () => {
    const { container } = render(
      <svg>
        <Line data={data} xAccessor={(d) => d.x} yAccessor={(d) => d.y} />
      </svg>
    )
    const path = container.querySelector('path')
    expect(path.getAttribute('d')).toBeTruthy()
  })
})
