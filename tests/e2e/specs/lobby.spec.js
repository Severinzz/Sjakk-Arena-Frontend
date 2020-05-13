// https://docs.cypress.io/api/introduction/api.html

let visitTournament = false // SET TO FALSE WHEN RUNNING THE WHOLE FILE. WHEN SKIPPING 1.st TEST SET TO FALSE

describe('Lobby page', () => {
  before(function setupMocks() {
    cy.visit('/')
  })

  beforeEach(function setTokenAndVisitLobby() {
    cy.setupLobbyStubs()
    cy.setupLobbyRoutes()
    if (visitTournament) {
      cy.visit('/').then(() => {
        localStorage.setItem('jwt_token', 'just a test token')
        cy.visit('/lobby/275621')
      })
    }
  })

  it('Should be navigation guarded', () => {
    localStorage.clear()
    cy.visit('/lobby/275621')
    cy.location('pathname').should('eq', '/tournament-creation')
    visitTournament = true
  })

  it('Should load lobby with players (names and icons) and tournament information', () => {
    cy.location('pathname').should('eq', '/lobby/275621')
    cy.get('.numberOfPlayers').should('have.text', ' Antall spillere: 0 ')
    cy.addPlayersToLobby()
    cy.get('.pinTitle').should('be.visible')
    cy.contains('loading...').should('not.be.visible')
    cy.get('.pin').should('have.text', ' 275621 ')
    cy.get('.name').should('have.text', 'Cypress tournament ')
    cy.get('[data-cy=start-time]').should('have.text', ' Starter: 20:55 ')
    cy.get('.date').should('have.text', ' Dato: 2024-05-15 ')
    cy.get('.numberOfPlayers').should('have.text', ' Antall spillere: 7 ')
  })

  it('Should remove player when kicked and cancel button takes you back', () => {
    cy.addPlayersToLobby()
    cy.get('#player0').click()
    cy.wait('@deletePlayer')
    cy.get('#player0').contains('Bjarne').should('not.be.visible')
    cy.get('#cancel').click()
    cy.location('pathname').should('eq', '/')
  })

  it('Should display error messages if server error', () => {
    cy.server()
    cy.route({
      method: 'PATCH', // Route all GET requests
      url: '/tournament/start', // that have a URL that matches '/users/*'
      delay: 5000,
      status: 500,
      response: 'fix:tournament'
    }).as('startTournamentFailed')

    cy.get('#start').click()
    cy.wait('@startTournamentFailed')
    cy.get('.v-alert').should('be.visible')
  })

  it('Should display error messages if timeout', () => {
    cy.server()
    cy.route({
      method: 'PATCH', // Route all GET requests
      url: '/tournament/start', // that have a URL that matches '/users/*'
      delay: 20000,
      status: 400,
      response: 'fix:tournament'
    }).as('startTournamentFailed')

    cy.get('#start').click()
    cy.wait('@startTournamentFailed')
    cy.get('.v-alert').should('be.visible')
  })
})
