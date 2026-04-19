import React from 'react'
import { render } from '@testing-library/react'
import Legend from '../Components/Legend'

const items = [
  { color: '#e74c3c', label: 'Apples' },
  { color: '#3498db', label: 'Bananas' },
  { color: '#2ecc71', label: 'Cherries' },
]

describe('Legend', () => {
  it('renders without crashing', () => {
    const { container } = render(<Legend items={items} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders a .Legend container', () => {
    const { container } = render(<Legend items={items} />)
    expect(container.querySelector('.Legend')).toBeInTheDocument()
  })

  it('renders one .Legend__item per entry', () => {
    const { container } = render(<Legend items={items} />)
    expect(container.querySelectorAll('.Legend__item')).toHaveLength(items.length)
  })

  it('renders a color swatch for each item', () => {
    const { container } = render(<Legend items={items} />)
    expect(container.querySelectorAll('.Legend__swatch')).toHaveLength(items.length)
  })

  it('renders the correct label text', () => {
    const { getByText } = render(<Legend items={items} />)
    expect(getByText('Apples')).toBeInTheDocument()
    expect(getByText('Bananas')).toBeInTheDocument()
    expect(getByText('Cherries')).toBeInTheDocument()
  })

  it('renders nothing meaningful for empty items', () => {
    const { container } = render(<Legend items={[]} />)
    expect(container.querySelectorAll('.Legend__item')).toHaveLength(0)
  })

  it('PieChart shows legend when showLegend is true', () => {
    const { default: PieChart } = require('../Charts/PieChart')
    const data = [
      { label: 'A', value: 40 },
      { label: 'B', value: 60 },
    ]
    const { container } = render(
      <PieChart
        data={data}
        valueAccessor={d => d.value}
        labelAccessor={d => d.label}
        showLegend
      />
    )
    expect(container.querySelector('.Legend')).toBeInTheDocument()
    expect(container.querySelectorAll('.Legend__item')).toHaveLength(2)
  })

  it('BarChart shows legend when showLegend is true', () => {
    const { default: BarChart } = require('../Charts/BarChart')
    const data = [
      { x: 'Jan', y: 10 },
      { x: 'Feb', y: 20 },
    ]
    const { container } = render(
      <BarChart data={data} yLabel="Sales" showLegend />
    )
    expect(container.querySelector('.Legend')).toBeInTheDocument()
  })
})
