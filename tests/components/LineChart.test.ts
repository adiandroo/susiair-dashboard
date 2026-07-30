import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LineChart from '~/components/LineChart.vue'

vi.mock('vue-chartjs', () => ({
  Line: {
    name: 'Line',
    props: ['data', 'options'],
    template: '<div class="mock-line-chart"><slot /></div>',
  },
}))

describe('LineChart', () => {
  it('renders with data and options props', () => {
    const data = { labels: [], datasets: [] }
    const options = { responsive: true }
    const wrapper = mount(LineChart, { props: { data, options } })
    expect(wrapper.find('.mock-line-chart').exists()).toBe(true)
  })
})
