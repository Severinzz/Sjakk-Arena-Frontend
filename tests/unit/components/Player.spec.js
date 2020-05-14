import { shallowMount } from '@vue/test-utils'

import Player from '@/components/props/Player'

const factory = (propsData) => {
  return shallowMount(Player, {
    propsData: {
      ...propsData
    }
  })
}

describe('Player', () => {
  it('should render player name with default icon', () => {
    const wrapper = factory({ playerName: 'frank' })
    expect(wrapper.find('p').text()).toBe('frank')
    expect(wrapper.find('i').classes()).toStrictEqual([ 'fas', 'fa-chess-queen', 'fa-3x' ])
  })

  it('should render player with icon', () => {
    const wrapper = factory({ playerName: 'frank', playerPiece: 'fas fa-chess-rook fa-3x' })
    expect(wrapper.find('p').text()).toBe('frank')
    expect(wrapper.find('i').classes()).toStrictEqual(['fas', 'fa-chess-rook', 'fa-3x'])
  })
})
