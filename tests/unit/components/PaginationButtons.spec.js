import { createLocalVue, mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'

import PaginationButtons from '../../../src/components/PaginationButtons'

Vue.use(Vuetify)

const localVue = createLocalVue()

const factory = (propsData) => {
  return mount(PaginationButtons, {
    localVue,
    propsData: {
      ...propsData
    }
  })
}

describe('PaginationButtons', () => {

  it('should emit event with the number of the clicked button', async() => {
    const wrapper = factory({
      numberOfItems: 20,
      prPage: 3 })
    wrapper.find('#button5').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('pageChanged')[0]).toEqual([5])
  })
  it('should match snapshot', () => {
    const wrapper = factory({
      numberOfItems: 20,
      prPage: 3 })
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('Jump left button should be visible after page change to right', async() => {
    const wrapper = factory({
      numberOfItems: 20,
      prPage: 3 })
    wrapper.find('.right').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.left').isVisible()).toBe(true)
  })
  it('should render the correct active button', () => {
    const wrapper = factory({
      numberOfItems: 20,
      prPage: 3 })
    wrapper.setData({ activeButton: 6 })
    expect(wrapper.find('.active-button').text()).toBe('6')
  })
  it('should render the correct amount of buttons', () => {
    // NOTE: maxVisibleButtons does NOT count "<<" and ">>" buttons!
    const visibleButtons = 3
    const wrapper = factory({
      numberOfItems: 60,
      prPage: 3,
      maxVisibleButtons: visibleButtons
    })
    wrapper.setData({ activeButton: 10 })
    expect(wrapper.findAll('.nrButton').length).toBe(visibleButtons)
  })
})
