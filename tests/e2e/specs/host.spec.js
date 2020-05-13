// https://docs.cypress.io/api/introduction/api.html

/*
* This is the full flow of a tournament from creating it to finishing it from the host point of view.
* Mostly used as a preview wil be skipped if .skip is present.
*/

const players = require('../fixtures/players')
let activeGames = require('../fixtures/active-games')

function fillOutForm() {
  cy.get('[data-cy=name]').type('Cypress tournament', { delay: 35 })
  cy.get('[data-cy=email]').type('Sjakkarena_testemail@test.com', { delay: 35 })
  fillOutTime()
  cy.get('[data-cy=tables]').type('10', { delay: 50 })
  cy.get('[data-cy=rounds]').type('1', { delay: 50 })
}

function fillOutTime() {
  cy.get('[data-cy=time-input]').click()
  cy.get('[data-cy=time-picker]').should('be.visible')
  selectTime()
}

function selectTime() {
  cy.wait(1000)
  cy.get('[style="left: 34.5%; top: 23.1532%;"]').should('be.visible').click({ force: true })
  cy.wait(1000)
  cy.get('[style="left: 25%; top: 6.69873%;"]').should('be.visible').click({ force: true })
}

describe('Complete flow of host', () => {
  before(function stubActions () {
    cy.visit('/')
    cy.window().then(win => {
      cy.stub(win.__store._actions.subscribeToPlayers, '0', (player) => {
        win.__store.commit('addPlayers', player)
      }).as('subToPlayers')

      cy.stub(win.__store._actions.subscribeToTournamentActive, '0', () => {
        win.__store.commit('setTournamentActive', false)
      }).as('subToTournamentActive')
    })
  })
  beforeEach(function startServer() {
    cy.server()
  })

  it('Home page should load with create-tournament tile', () => {
    cy.get('[data-cy=create-tournament]').should('be.visible').click()
  })

  it('Should fill out all input fields and be navigated to lobby page', () => {
    cy.route({
      method: 'POST', // Route all GET requests
      url: '/new-tournament', // that have a URL that matches '/users/*'
      delay: 0,
      status: 200,
      response: {
        tournament_id: 275621,
        jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUT1VSTkFNRU5UIiwianRpIjoiNTMwNTA4In0.yxofGyRlQl0BTOmwXdkLbcC8cr4mG-afyBfoto5nuo8'
      }
    }).as('tournamentRes')

    cy.route({
      method: 'GET', // Route all GET requests
      url: '/tournament', // that have a URL that matches '/users/*'
      delay: 0,
      status: 200,
      response: 'fixture:tournament'
    }).as('getTournament')

    fillOutForm()
    cy.get('[data-cy="endtime-switch"]').parent().click()
    cy.get('[data-cy="endtime"]').should('be.visible')
    cy.get('[data-cy="dateTimeInput"]').click()
    cy.wait(500)
    cy.get('.v-date-picker-title__year').should('be.visible').click()
    cy.wait(500)
    cy.get('.v-date-picker-years').contains('2024').click()
    cy.wait(500)
    cy.get('tbody > :nth-child(2) > :nth-child(2)').click()
    cy.wait(500)
    cy.get(':nth-child(3) > :nth-child(4)').click()
    cy.wait(500)
    cy.get('.v-picker__actions > :nth-child(1)').click()
    cy.wait(500)
    selectTime()
    cy.get('[data-cy="dateTimeInput"]').should('have.value', '2024-05-15  23:55')

    cy.window().then(win => {
      cy.stub(win.__store._actions.subscribeToPlayers, '0', (player) => {
        win.__store.commit('addPlayers', player)
      }).as('subToPlayers')

      cy.stub(win.__store._actions.subscribeToTournamentActive, '0', () => {
        win.__store.commit('setTournamentActive', false)
      }).as('subToTournamentActive')
    })

    cy.get('[data-cy=create]').should('be.visible').click()
    cy.wait('@tournamentRes')
    cy.location('pathname').should('eq', '/lobby/275621')
  })

  it('Should add players and kick a player', () => {
    cy.route({
      method: 'DELETE', // Route all GET requests
      url: '/tournament/player/delete/*', // that have a URL that matches '/users/*'
      delay: 0,
      status: 200,
      response: {}
    }).as('deletePlayer')

    cy.route({
      method: 'PATCH', // Route all GET requests
      url: '/tournament/start', // that have a URL that matches '/users/*'
      delay: 0,
      status: 200,
      response: 'fix:tournament'
    }).as('startTournament')

    let playersList = []
    players.forEach((player) => {
      cy.window().then(win => {
        cy.wait(Math.floor(Math.random() * (3000 - 500)) + 500)
        playersList.push(player)
        win.__store._mutations.addPlayers[0](playersList)
      })
    })
    cy.window().then(win => {
      win.__store._mutations.addPlayer[0]({ name: 'o((>ω< ))o ', icon: 'fas fa-chess-knight fa-3x' })
    })
    cy.wait(3000)
    cy.get('#player0').click()
    cy.wait(3000)
    localStorage.setItem('jwt_token', 'token')
    cy.get('#start').click()
    cy.window().then(win => {
      cy.stub(win.__store._actions.subscribeToTournamentActive, '0', () => {
        win.__store.commit('setTournamentActive', true)
      }).as('subToTournamentActive')
    })
  })

  it('', () => {
    cy.window().then(win => {
      cy.stub(win.__store._actions.subscribeToPlayers, '0', (player) => {
        win.__store.commit('addPlayers', player)
      }).as('subToLeaderboard')

      cy.stub(win.__store._actions.subscribeToActiveGames, '0', (listOfActiveGames) => {
        win.__store.commit('setActiveGames', listOfActiveGames)
      }).as('subToTournamentActive')

      cy.stub(win.__store._actions.subscribeToInvalidGames, '0', (invalidGames) => {
        win.__store.commit('setInvalidGames', invalidGames)
      }).as('subToTournamentActive')
    })

    cy.wait(1000)
    cy.get('#button2').click()
    cy.wait(1000)
    cy.get('#button1').click()
    cy.wait(1000)
    cy.get('#Games').click()

    cy.window().then(win => {
      win.__store._actions.subscribeToActiveGames[0](activeGames)
    })

    cy.wait(2000)
    cy.window().then(win => {
      win.__store._actions.subscribeToActiveGames[0]([])
    })

    cy.window().then(win => {
      cy.fixture('sortedPlayersPoints').then(players => {
        win.__store._actions.subscribeToPlayers[0](players)
      })
    })

    cy.wait(2000)
    cy.get('#Games').click()
    cy.wait(3000)

    cy.get('#Pause').click()
    cy.scrollTo('top', { duration: 1500 })
    cy.wait(1000)
    cy.scrollTo('center', { duration: 1500 })
    cy.wait(1000)
    cy.get('#Pause').click()
    cy.scrollTo('center', { duration: 1500 })

    cy.window().then(win => {
      cy.fixture('invalidGame').then(game => {
        win.__store._actions.subscribeToInvalidGames[0](game)
      })
    })

    cy.wait(500)
    cy.get('tbody > .v-btn').click()

    cy.wait(500)
    cy.get('[data-cy="stalemate"]').check({ force: true })

    cy.route({
      method: 'PATCH', // Route all GET requests
      url: 'tournament/games/result/16/*', // that have a URL that matches '/users/*'
      delay: 2000,
      status: 200,
      response: {}
    }).as('changeResult')

    cy.route({
      method: 'PATCH', // Route all GET requests
      url: 'tournament/pause', // that have a URL that matches '/users/*'
      delay: 2000,
      status: 200,
      response: {}
    }).as('pause')

    cy.route({
      method: 'PATCH', // Route all GET requests
      url: 'tournament/unpause', // that have a URL that matches '/users/*'
      delay: 2000,
      status: 200,
      response: {}
    }).as('pause')

    cy.get('[data-cy=submit]').click()

    cy.wait('@changeResult')
    cy.wait(500)

    cy.window().then(win => {
      win.__store._actions.subscribeToInvalidGames[0]([])
    })

    cy.window().then(win => {
      cy.fixture('sortedPlayersPoints').then(players => {
        let player = players[0]
        player.points = 2.0
        players[0] = player
        win.__store._actions.subscribeToPlayers[0](players)
      })
    })
    cy.wait(2000)
    cy.get('#Stop').click()
    cy.wait(3000)

    cy.route({
      method: 'patch', // Route all GET requests
      url: 'end', // that have a URL that matches '/users/*'
      delay: 0,
      status: 200,
      response: {}
    }).as('endTournament')

    cy.get('[data-cy=leave]').click()
  })
})
