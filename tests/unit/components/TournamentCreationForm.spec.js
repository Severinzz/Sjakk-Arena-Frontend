import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import TournamentCreationForm from '@/components/TournamentCreationForm'

Vue.use(Vuetify)

const localVue = createLocalVue()

const factory = (formData, vuetify) => {
  return mount(TournamentCreationForm, {
    vuetify,
    localVue,
    data() {
      return {
        ...formData
      }
    }
  })
}

let formData = {
  startTime: '13:30',
  endTime: '20:30',
  name: 'Chess open',
  email: 'test@unittest.test',
  tournamentName: 'Test tournament',
  tables: '20',
  pause: '5',
  rounds: '30',
  earlyStart: true
}

describe('TournamentCreationForm', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('inputs should reset when button clicked', () => {
    let wrapper = factory(formData, vuetify)
    wrapper.find('#clear-btn').trigger('click')
    let data = wrapper.vm.$data

    for (let i = 0; i < 8; i++) {
      expect(data[i]).toBe(undefined)
    }
  })
})
