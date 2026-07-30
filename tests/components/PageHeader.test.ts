import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHeader from '~/components/PageHeader.vue'

describe('PageHeader', () => {
  it('renders the title prop', () => {
    const wrapper = mount(PageHeader, { props: { title: 'Schedule' } })
    expect(wrapper.text()).toContain('Schedule')
  })

  it('renders an h1 element', () => {
    const wrapper = mount(PageHeader, { props: { title: 'Logbook' } })
    expect(wrapper.find('h1').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'Test' },
      slots: { default: '<span class="slot-content">Extra</span>' },
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Extra')
  })
})
