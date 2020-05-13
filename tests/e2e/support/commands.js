// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('setupLobbyStubs', () => {
  cy.window().then(win => {
    cy.stub(win.__store._actions.subscribeToTournamentActive, '0', () => {
      win.__store.commit('setTournamentActive', false)
    }).as('subToTournamentActive')
  })

  cy.window().then(win => {
    cy.stub(win.__store._actions.subscribeToPlayers, '0', (player) => {
      win.__store.commit('addPlayers', player)
    }).as('subToPlayers')
  })
})

Cypress.Commands.add('setupLobbyRoutes', () => {
  cy.server()
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

  cy.route({
    method: 'GET', // Route all GET requests
    url: '/tournament/', // that have a URL that matches '/users/*'
    delay: 0,
    status: 200,
    response: 'fixture:tournament'
  }).as('getTournament')
})

Cypress.Commands.add('addPlayersToLobby', () => {
  let playersList = []
  cy.fixture('players').then(players => {
    players.forEach((player) => {
      cy.window().then(win => {
        playersList.push(player)
        win.__store._mutations.addPlayers[0](playersList)
      })
      cy.get('#player0').contains(player.name).should('be.visible')
      cy.get('#player0').children('i').should('have.class', player.icon)
    })
  })
})

Cypress.Commands.add('login', (token) => {
  localStorage.setItem('jwt_token', token)
})

Cypress.Commands.add('playerDetailsKick', () => {
  cy.get('[data-cy=remove]').click()
  cy.get('[data-cy=reasoning]').type('Har forlatt lokalet')
  cy.get('[data-cy=remove-confirm]').click()
  cy.wait('@removePlayer')
})

Cypress.Commands.add('stubSocketPlayerLobby', () => {
  cy.window().then(win => {
    cy.stub(win.__store._actions.subscribeToTournamentActive, '0', () => {
      win.__store.commit('setTournamentActive', false)
    }).as('subToTournamentActive')

    cy.stub(win.__store._actions.subscribeToActiveGame, '0', (newGame) => {
      if (newGame.active) {
        win.__store.commit('setActiveGame', newGame)
        win.__store.dispatch('setPlayerPaired', true)
      } else {
        win.__store.commit('setPaired', false)
      }
    }).as('subToActiveGame')

    cy.stub(win.__store._actions.subscribeToPoints, '0', () => {
      win.__store.commit('setPoints', { points: 0.0 })
    }).as('subToPoints')

    cy.stub(win.__store._actions.subscribeToSuggestedResult, '0', (resultDialog) => {
      if (resultDialog.valid === true && resultDialog.opponents_disagree === false) {
        win.__store.commit('resetActiveGame')
        win.__store.dispatch('setPlayerPaired', false)
      }
      win.__store.commit('setResultDialog', resultDialog)
    }).as('subToSuggestedResult')

    cy.stub(win.__store._actions.subscribeToPlayerKicked, '0', () => {
    }).as('subToKicked')
  })
})
