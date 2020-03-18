import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import TournamentCreationForm from '@/components/TournamentCreationForm'

Vue.use(Vuetify)
Vue.use(Vuex)

const localVue = createLocalVue()

const factory = (formData, vuetify, store) => {
  return mount(TournamentCreationForm, {
    vuetify,
    localVue,
    store,
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
  let store
  let actions
  beforeEach(() => {
    vuetify = new Vuetify()
    actions = {
      close: jest.fn()
    }
    store = new Vuex.Store({
      actions
    })
  })

  it('inputs should reset when button clicked', () => {
    let wrapper = factory(formData, vuetify, store)
    wrapper.find('#clear-btn').trigger('click')
    let data = wrapper.vm.$data

    for (let i = 0; i < 8; i++) {
      expect(data[i]).toBe(undefined)
    }
  })
})
