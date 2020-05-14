// https://docs.cypress.io/api/introduction/api.html

describe('Player detail page', () => {
  beforeEach(function visitRootPage() {
    cy.login('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUT1VSTkFNRU5UIiwianRpIjoiNTMwNTA4In0.yxofGyRlQl0BTOmwXdkLbcC8cr4mG-afyBfoto5nuo8')
    cy.visit('/tournament/player/133')
  })

  it('Should show player name, points, previous games table, remove button, pagination and no errors', () => {
    cy.get('[data-cy=info-box]').should('not.be.visible')
    cy.get('[data-cy=alert-box]').should('not.be.visible')
    cy.get('[data-cy=points]').should('be.visible')
    cy.get('[data-cy=name]').contains('Ole').should('be.visible')
    cy.get('.tableMenu').should('be.visible')
    cy.get('[data-cy=table]').should('be.visible')
    cy.get('#button1').should('be.visible')
    cy.get('p').should('be.visible')
    cy.get('[data-cy=remove]').should('be.visible')
  })

  it('Should show info box and disable remove button when player is no longer in the tournament', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:8080/tournament/player/133',
      delay: 2000,
      status: 200,
      response: 'fixture:player'
    }).as('getPlayer')
    cy.visit('/tournament/player/133')
    cy.get('[data-cy=remove]').should('be.disabled')
    cy.wait('@getPlayer')
    cy.get('[data-cy=info-box]').should('be.visible')
    cy.get('[data-cy=remove]').should('be.disabled')
  })

  it('Should display error when player fetch fails', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:8080/tournament/player/133',
      delay: 2000,
      status: 400,
      response: 'fixture:player'
    }).as('getPlayer')
    cy.visit('/tournament/player/133')
    cy.get('[data-cy=remove]').should('be.disabled')
    cy.wait('@getPlayer')
    cy.get('[data-cy=alert-box]').contains('Feilmelding: 400. Du har ikke tilgang til denne spilleren')
      .should('be.visible')

    cy.route({
      method: 'GET',
      url: 'http://localhost:8080/tournament/player/*',
      delay: 2000,
      status: 404,
      response: {}
    }).as('getPlayer')
    cy.visit('/tournament/player/133')
    cy.wait('@getPlayer')
    cy.get('[data-cy=alert-box]').contains('Error code: 404, undefined')
      .should('be.visible')
  })

  it('Should remove player, display error when failed and success on success', () => {
    cy.server()
    cy.route({
      method: 'PATCH',
      url: 'http://localhost:8080/tournament/player/inactivate/*',
      response: {}
    }).as('removePlayer')
    cy.playerDetailsKick()
    cy.get('[data-cy=remove]').should('be.disabled')
    cy.get('[data-cy=alert-box]').should('be.visible')

    cy.visit('/tournament/player/133')
    cy.route({
      method: 'PATCH', // Route all GET requests
      url: 'http://localhost:8080/tournament/player/inactivate/*',
      delay: 0,
      status: 400,
      response: {}
    }).as('removePlayer')
    cy.playerDetailsKick()
    cy.get('[data-cy=remove]').should('be.disabled')
    cy.get('[data-cy=alert-box]').should('be.visible')
  })
})
