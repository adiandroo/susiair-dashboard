import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaceholderContent from '~/components/PlaceholderContent.vue'

describe('PlaceholderContent', () => {
  it('renders title and description', () => {
    const wrapper = mount(PlaceholderContent, {
      props: { title: 'Logbook', description: 'Feature coming soon.' },
    })
    expect(wrapper.text()).toContain('Logbook')
    expect(wrapper.text()).toContain('Feature coming soon.')
  })

  it('renders an h3 with the title', () => {
    const wrapper = mount(PlaceholderContent, {
      props: { title: 'Settings', description: 'Desc' },
    })
    expect(wrapper.find('h3').exists()).toBe(true)
  })

  it('renders default icon when no icon slot provided', () => {
    const wrapper = mount(PlaceholderContent, {
      props: { title: 'Test', description: 'Desc' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders custom icon via slot', () => {
    const wrapper = mount(PlaceholderContent, {
      props: { title: 'Test', description: 'Desc' },
      slots: { icon: '<svg class="custom-icon" />' },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })
})
