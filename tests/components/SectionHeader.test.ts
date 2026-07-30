import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionHeader from '~/components/SectionHeader.vue'

describe('SectionHeader', () => {
  it('renders the title', () => {
    const wrapper = mount(SectionHeader, { props: { title: 'Upcoming Flight' } })
    expect(wrapper.text()).toContain('Upcoming Flight')
  })

  it('does not render action button when no actionLabel', () => {
    const wrapper = mount(SectionHeader, { props: { title: 'Test' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders action button when actionLabel provided', () => {
    const wrapper = mount(SectionHeader, {
      props: { title: 'Test', actionLabel: 'See all' },
    })
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('See all')
  })

  it('emits action event when button clicked', async () => {
    const wrapper = mount(SectionHeader, {
      props: { title: 'Test', actionLabel: 'See all' },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('action')).toBeTruthy()
    expect(wrapper.emitted('action')).toHaveLength(1)
  })
})
