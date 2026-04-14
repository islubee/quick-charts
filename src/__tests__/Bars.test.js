import React from 'react'
import { render } from '@testing-library/react'
import Bars from '../Components/Bars'

const mkData = (n) =>
  Array.from({ length: n }, (_, i) => ({ x0: i * 10, x1: (i + 1) * 10, count: i + 1 }))

describe('Bars', () => {
  it('renders one <rect> per data point', () => {
    const data = mkData(4)
    const { container } = render(
      <svg>
        <Bars
          data={data}
          keyAccessor={(d, i) => i}
          xAccessor={(d) => d.x0}
          yAccessor={(d) => d.count}
          widthAccessor={(d) => d.x1 - d.x0}
          heightAccessor={(d) => d.count * 5}
        />
      </svg>
    )
    expect(container.querySelectorAll('rect')).toHaveLength(4)
  })

  it('applies the Bars__rect class to every rect', () => {
    const data = mkData(2)
    const { container } = render(
      <svg>
        <Bars
          data={data}
          keyAccessor={(d, i) => i}
          xAccessor={(d) => d.x0}
          yAccessor={(d) => d.count}
          widthAccessor={(d) => 10}
          heightAccessor={(d) => 20}
        />
      </svg>
    )
    container.querySelectorAll('rect').forEach((r) => {
      expect(r).toHaveClass('Bars__rect')
    })
  })

  it('clamps negative widths to 0', () => {
    const { container } = render(
      <svg>
        <Bars
          data={[{ x: 0 }]}
          keyAccessor={(d, i) => i}
          xAccessor={() => 0}
          yAccessor={() => 0}
          widthAccessor={() => -5}
          heightAccessor={() => 10}
        />
      </svg>
    )
    expect(container.querySelector('rect')).toHaveAttribute('width', '0')
  })

  it('clamps negative heights to 0', () => {
    const { container } = render(
      <svg>
        <Bars
          data={[{ x: 0 }]}
          keyAccessor={(d, i) => i}
          xAccessor={() => 0}
          yAccessor={() => 0}
          widthAccessor={() => 10}
          heightAccessor={() => -3}
        />
      </svg>
    )
    expect(container.querySelector('rect')).toHaveAttribute('height', '0')
  })

  it('renders nothing for an empty dataset', () => {
    const { container } = render(
      <svg>
        <Bars
          data={[]}
          keyAccessor={(d, i) => i}
          xAccessor={() => 0}
          yAccessor={() => 0}
          widthAccessor={() => 10}
          heightAccessor={() => 10}
        />
      </svg>
    )
    expect(container.querySelectorAll('rect')).toHaveLength(0)
  })
})
