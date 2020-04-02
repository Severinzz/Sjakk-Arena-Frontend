import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'

import DateTime from '@/components/DateTime'

Vue.use(Vuetify)

const localVue = createLocalVue()

const factory = (propsData, vuetify) => {
  return shallowMount(DateTime, {
    localVue,
    vuetify,
    propsData: {
      ...propsData
    }
  })
}

describe('DateTime', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('emitted event should contain date and time in correct format', async () => {
    const eventName = 'endDateTime'
    const wrapper = factory({ eventName: eventName }, vuetify)
    wrapper.setData({
      date: '2020-03-04',
      time: '17:21',
      dateMenu: true,
      menuOpen: true
    })
    wrapper.vm.onChange(eventName)

    expect(wrapper.emitted(eventName)[0]).toEqual(['2020-03-04t17:21'])
  })
})
