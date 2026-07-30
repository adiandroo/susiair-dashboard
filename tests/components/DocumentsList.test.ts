import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import DocumentsList from '~/components/DocumentsList.vue'

vi.mock('~/data/mock-documents.json', () => ({
  default: {
    thresholds: { warningDays: 30 },
    documents: [
      { id: '1', label: 'Medical Certificate', expiryDate: '2026-12-31' },
      { id: '2', label: 'License', expiryDate: '2026-06-15' },
      { id: '3', label: 'Passport', expiryDate: '2025-06-01' },
    ],
  },
}))

vi.mock('~/data/mock-schedules.json', () => ({
  default: { schedules: [], legend: [] },
}))

vi.mock('~/data/mock-flight-hours.json', () => ({
  default: {
    pilot: { name: 'Test', totalFlightHours: 0 },
    limits: {},
    chartBounds: {},
    flightHours: [],
  },
}))

describe('DocumentsList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders document items', () => {
    const wrapper = mount(DocumentsList)
    const items = wrapper.findAll('.doc-item')
    expect(items.length).toBeGreaterThan(0)
  })

  it('renders document labels', () => {
    const wrapper = mount(DocumentsList)
    expect(wrapper.text()).toContain('Medical Certificate')
    expect(wrapper.text()).toContain('License')
  })

  it('shows expired badge for expired documents', () => {
    const wrapper = mount(DocumentsList)
    expect(wrapper.text()).toContain('Expired')
  })

  it('renders skeleton items when loading', () => {
    const wrapper = mount(DocumentsList, { props: { loading: true } })
    const skeletons = wrapper.findAll('.doc-item')
    expect(skeletons).toHaveLength(3)
    expect(wrapper.findAll('.skeleton-label').length).toBeGreaterThan(0)
  })
})
