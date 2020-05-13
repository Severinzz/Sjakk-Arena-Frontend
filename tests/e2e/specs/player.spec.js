/*
* This is the full flow of a tournament from joining, playing some games then leaving it.
* Mostly used as a preview wil be skipped if .skip is present.
*/

// https://docs.cypress.io/api/introduction/api.html

describe('Home page', () => {
  it('Should load home page', () => {
    cy.visit('/')
    cy.get('[data-cy=play]').click()
  })

  it('enters a tournament', () => {
    cy.stubSocketPlayerLobby()
    cy.server()
    cy.route({
      method: 'POST', // Route all GET requests
      url: 'new-player', // that have a URL that matches '/users/*'
      status: 200,
      delay: 2000,
      response: {
        jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQTEFZRVIiLCJqdGkiOiIxNTIifQ.6oc30Qlni_tMXzncRi3IEuvLsLxnFzT2P7JpF90NBFQ'
      }
    }).as('newPlayer')

    cy.route({
      method: 'GET', // Route all GET requests
      url: 'player', // that have a URL that matches '/users/*'
      status: 200,
      response: {
        name: 'Cypress test player',
        points: 0
      }
    }).as('newPlayer')

    cy.route({
      method: 'GET', // Route all GET requests
      url: 'tournament', // that have a URL that matches '/users/*'
      status: 200,
      response: {
        name: 'Cypress Tournament',
        start: '2020-05-13 01:29:12',
        started: false
      }
    }).as('getTournament')

    cy.get('[data-cy=game-pin]').should('be.visible').type('1923', { delay: 60 })
    cy.get('[data-cy=player-name]').should('be.visible').type('Cypress test player', { delay: 60 })
    cy.get('[data-cy=submit]').click()

    cy.wait('@newPlayer')
    cy.wait('@getTournament')
    cy.wait(5000)
  })

  it('Gets opponent and registers result', () => {
    cy.stubSocketPlayerLobby()
    cy.server()
    cy.route({
      method: 'PUT',
      url: 'add-result*',
      status: 200,
      response: {}
    }).as('addResult')

    cy.window().then(win => {
      win.__store.commit('setPoints', '0')
      win.__store.commit('setTournamentActive', true)
      let game = {
        opponent: 'R.E.M',
        opponent_id: '123',
        colour: 'white',
        result: 0.0
      }
      win.__store.commit('setActiveGame', game)
      win.__store.dispatch('setPlayerPaired', true)
    })
    cy.wait(5000)
    cy.get('[data-cy=register-result]').click()
    cy.wait(2000)
    cy.get('[data-cy=stalemate]').check({ force: true })
    cy.wait(1000)
    cy.get('[data-cy=send-result]').click()
    cy.wait('@addResult')
    cy.wait(500)
    cy.get('[data-cy=info-dia-btn]').click()
    cy.wait(5000)
    cy.window().then(win => {
      win.__store.commit('resetActiveGame')
      win.__store.dispatch('setPlayerPaired', false)
      win.__store.commit('setPoints', 0.5)
    })
    cy.wait(5000)
  })

  it('Gets opponent, opponents suggests result and player accepts', () => {
    cy.stubSocketPlayerLobby()
    cy.server()
    cy.route({
      method: 'PATCH',
      url: 'validate',
      status: 200,
      response: {}
    }).as('addResult')

    cy.window().then(win => {
      let game = {
        opponent: 'Hikaru',
        opponent_id: '120',
        colour: 'black',
        result: 0.0
      }
      win.__store.commit('setActiveGame', game)
      win.__store.dispatch('setPlayerPaired', true)
    })
    cy.wait(5000)

    cy.window().then(win => {
      let game = {
        game_id: 22,
        opponents_disagree: false,
        suggested_result: 0,
        valid: false
      }
      win.__store.commit('setResultDialog', game)
    })
    cy.wait(5000)
    cy.get('.success').click()
    cy.wait(1000)
    cy.window().then(win => {
      win.__store.commit('resetActiveGame')
      win.__store.dispatch('setPlayerPaired', false)
      win.__store.commit('setPoints', 0.5)
    })
  })

  it('checks past results and leaves tournament', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'inactive',
      status: 200,
      response: [
        {
          white_player_name: 'Cypress test player',
          black_player_name: 'R.E.M',
          colour: 'white',
          result: 1.0
        },
        {
          black_player_name: 'Cypress test player',
          white_player_name: 'Hikaru',
          colour: 'black',
          result: 0.0
        }
      ]
    }).as('addResult')
    cy.get('[data-cy=past-results]').click()
    cy.wait(5000)
    cy.get('[data-cy=leave-tournament]').click()
    cy.wait(2000)
    cy.get('[data-cy=leave]').click()
  })
})
