import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import HoursToLimit from '~/components/HoursToLimit.vue'
import { useFlightStore } from '~/stores/flight'

vi.mock('vue-chartjs', () => ({
  Line: {
    name: 'Line',
    props: ['data', 'options'],
    template: '<div class="mock-line-chart" />',
  },
}))

vi.mock('~/data/mock-flight-hours.json', () => ({
  default: {
    pilot: { name: 'John Doe', totalFlightHours: 1444.5 },
    limits: { daily: 8, weekly: 40, monthly: 100, annual: 1050 },
    chartBounds: {
      '1w': { limit: 40, max: 45, windowDays: 7, displayRangeDays: 7 },
      '1m': { limit: 100, max: 125, windowDays: 30, displayRangeDays: 7 },
      '3m': { limit: 300, max: 325, windowDays: 90, displayRangeDays: 7 },
      '6m': { limit: 600, max: 625, windowDays: 180, displayRangeDays: 7 },
      '1y': { limit: 1050, max: 1250, windowDays: 365, displayRangeDays: 7 },
    },
    flightHours: Array.from({ length: 400 }, (_, i) => {
      const d = new Date(2026, 4, 31)
      d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      return { date: ds, hours: +(Math.random() * 8).toFixed(1) }
    }),
  },
}))

const stubClientOnly = {
  'client-only': { template: '<slot />' },
  LineChart: { template: '<div class="mock-line-chart" />' },
}

describe('HoursToLimit', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders 4 limit cards', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const cards = wrapper.findAll('.limit-card')
    expect(cards).toHaveLength(4)
  })

  it('renders toggle buttons', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const toggles = wrapper.findAll('.toggle-btn')
    expect(toggles).toHaveLength(5)
  })

  it('default toggle is 1w', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const first = wrapper.find('.toggle-btn')
    expect(first.classes()).toContain('active')
    expect(first.text()).toBe('1w')
  })

  it('changes toggle on click', async () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const toggles = wrapper.findAll('.toggle-btn')
    await toggles[1].trigger('click')
    expect(toggles[1].classes()).toContain('active')
    expect(toggles[0].classes()).not.toContain('active')
  })

  it('renders chart card', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    expect(wrapper.find('.chart-card').exists()).toBe(true)
  })

  it('renders skeleton cards when loading', () => {
    const wrapper = mount(HoursToLimit, {
      props: { loading: true },
      global: { stubs: stubClientOnly },
    })
    const skeletons = wrapper.findAll('.limit-card--skeleton')
    expect(skeletons).toHaveLength(4)
  })

  it('renders skeleton chart when loading', () => {
    const wrapper = mount(HoursToLimit, {
      props: { loading: true },
      global: { stubs: stubClientOnly },
    })
    expect(wrapper.find('.chart-skeleton').exists()).toBe(true)
  })

  it('renders display values in cards', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const values = wrapper.findAll('.limit-card__hours')
    expect(values.length).toBeGreaterThan(0)
    values.forEach((v) => {
      expect(parseFloat(v.text())).not.toBeNaN()
    })
  })

  it('chartData backgroundColor returns fallback when no chartArea', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const data = wrapper.vm.chartData
    const bgFn = data.datasets[0].backgroundColor
    const result = bgFn({ chart: {} })
    expect(result).toBe('rgba(34,197,232,0.08)')
  })

  it('chartData backgroundColor creates gradient when chartArea exists', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const data = wrapper.vm.chartData
    const bgFn = data.datasets[0].backgroundColor
    const addColorStop = vi.fn()
    const mockCtx = {
      chart: {
        ctx: { createLinearGradient: () => ({ addColorStop }) },
        chartArea: { top: 0, bottom: 100 },
      },
    }
    const gradient = bgFn(mockCtx)
    expect(addColorStop).toHaveBeenCalledWith(0, 'rgba(34,197,232,0.15)')
    expect(addColorStop).toHaveBeenCalledWith(1, 'rgba(34,197,232,0.01)')
    expect(gradient.addColorStop).toBe(addColorStop)
  })

  it('chartOpts tooltip label formats dataset 0 as hours', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const opts = wrapper.vm.chartOpts
    const label = opts.plugins.tooltip.callbacks.label
    expect(label({ datasetIndex: 0, raw: 5 })).toBe('5h')
  })

  it('chartOpts tooltip label formats dataset 1 as limit', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const opts = wrapper.vm.chartOpts
    const label = opts.plugins.tooltip.callbacks.label
    expect(label({ datasetIndex: 1, raw: 10 })).toBe('Limit: 10h')
  })

  it('chartOpts y-axis tick callback formats with h suffix', () => {
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    const opts = wrapper.vm.chartOpts
    const cb = opts.scales.y.ticks.callback
    expect(cb(100)).toBe('100h')
  })

  it('renders red pct color when pct >= 100', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useFlightStore(pinia)
    store.$patch({
      flightHours: {
        pilot: { name: '', totalFlightHours: 0 },
        limits: { daily: 8, weekly: 40, monthly: 100, annual: 1050 },
        chartBounds: {
          '1w': { limit: 40, max: 45, windowDays: 7, displayRangeDays: 7 },
          '1m': { limit: 100, max: 125, windowDays: 30, displayRangeDays: 7 },
          '3m': { limit: 300, max: 325, windowDays: 90, displayRangeDays: 7 },
          '6m': { limit: 600, max: 625, windowDays: 180, displayRangeDays: 7 },
          '1y': { limit: 1050, max: 1250, windowDays: 365, displayRangeDays: 7 },
        },
        flightHours: [{ date: '2026-05-31', hours: 10 }],
      },
    })
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    expect(wrapper.find('.limit-card__pct').attributes('style')).toContain('rgb(220, 38, 38)')
  })

  it('renders amber pct color when pct >= 80', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useFlightStore(pinia)
    store.$patch({
      flightHours: {
        pilot: { name: '', totalFlightHours: 0 },
        limits: { daily: 8, weekly: 40, monthly: 100, annual: 1050 },
        chartBounds: {
          '1w': { limit: 40, max: 45, windowDays: 7, displayRangeDays: 7 },
          '1m': { limit: 100, max: 125, windowDays: 30, displayRangeDays: 7 },
          '3m': { limit: 300, max: 325, windowDays: 90, displayRangeDays: 7 },
          '6m': { limit: 600, max: 625, windowDays: 180, displayRangeDays: 7 },
          '1y': { limit: 1050, max: 1250, windowDays: 365, displayRangeDays: 7 },
        },
        flightHours: [{ date: '2026-05-31', hours: 7 }],
      },
    })
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    expect(wrapper.find('.limit-card__pct').attributes('style')).toContain('rgb(217, 119, 6)')
  })

  it('renders green pct color when pct < 80', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useFlightStore(pinia)
    store.$patch({
      flightHours: {
        pilot: { name: '', totalFlightHours: 0 },
        limits: { daily: 8, weekly: 40, monthly: 100, annual: 1050 },
        chartBounds: {
          '1w': { limit: 40, max: 45, windowDays: 7, displayRangeDays: 7 },
          '1m': { limit: 100, max: 125, windowDays: 30, displayRangeDays: 7 },
          '3m': { limit: 300, max: 325, windowDays: 90, displayRangeDays: 7 },
          '6m': { limit: 600, max: 625, windowDays: 180, displayRangeDays: 7 },
          '1y': { limit: 1050, max: 1250, windowDays: 365, displayRangeDays: 7 },
        },
        flightHours: [{ date: '2026-05-31', hours: 3 }],
      },
    })
    const wrapper = mount(HoursToLimit, { global: { stubs: stubClientOnly } })
    expect(wrapper.find('.limit-card__pct').attributes('style')).toContain('rgb(5, 150, 105)')
  })
})
