// https://docs.cypress.io/api/introduction/api.html

describe('Login with admin id', () => {
  beforeEach(function visitRootPage() {
    cy.visit('/enter-AID')
  })

  it('Should have admin id input and submit button', () => {
    cy.server() // enable response stubbing
    cy.route({
      method: 'GET', // Route all GET requests
      url: '/sign-in/*', // that have a URL that matches '/users/*'
      response: {
        jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUT1VSTkFNRU5UIiwianRpIjoiNTMwNTA4In0.yxofGyRlQl0BTOmwXdkLbcC8cr4mG-afyBfoto5nuo8',
        tournament_id: 530508
      } // and force the response to be: []
    })
    cy.get('[data-cy=adminId]').should('be.visible').type('ugKon', { delay: 35 })
    cy.get('[data-cy="submit"]').click()
  })

  it('Should have cancel button that navigates home', () => {
    cy.get('[data-cy=cancel]').click()
    cy.location('pathname').should('eq', '/')
    cy.wait(500)
  })

  it('Should show loading circle, then error message with entered adminId, then hide error circle', () => {
    cy.server() // enable response stubbing
    cy.route({
      method: 'GET', // Route all GET requests
      url: '/sign-in/*', // that have a URL that matches '/users/*'
      delay: 2000,
      status: 404,
      response: {
        error: 'ID not found'
      }
    }).as('errorRes')
    cy.get('[data-cy=adminId]').should('be.visible').type('abcdefg1234')
    cy.get('[data-cy="submit"]').click()
    let circle = cy.get('[data-cy=loadingCircle]')
    circle.should('be.visible')
    cy.wait('@errorRes')
    cy.get('#error').should('be.visible').contains('abcdefg1234')
    cy.get('[data-cy=loadingCircle]').should('not.be.visible')
  })

  it('Should route to the correct page with game-pin as a part of the  path', () => {
    cy.window().then(() => localStorage.setItem('jwt_token',
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUT1VSTkFNRU5UIiwianRpIjoiNTMwNTA4In0.yxofGyRlQl0BTOmwXdkLbcC8cr4mG-afyBfoto5nuo8'))
    cy.window().should('have.property', '__store')
    cy.get('[data-cy=adminId]').should('be.visible').type('ugKon', { delay: 35 })
    cy.get('[data-cy="submit"]').click()
    cy.location('pathname').should('eq', '/tournament/530508')
    cy.scrollTo('bottom', { duration: 1500 })
    cy.scrollTo('top', { duration: 1500 })
  })
})
