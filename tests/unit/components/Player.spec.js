import { shallowMount } from '@vue/test-utils'

import Player from '@/components/player'

const factory = (propsData) => {
  return shallowMount(Player, {
    propsData: {
      ...propsData
    }
  })
}

describe('Player', () => {
  it('should render player name without icon', () => {
    const wrapper = factory({ playerName: 'frank' })
    expect(wrapper.find('p').text()).toBe('frank')
    expect(wrapper.find('i').isEmpty()).toBe(true)
  })
})
