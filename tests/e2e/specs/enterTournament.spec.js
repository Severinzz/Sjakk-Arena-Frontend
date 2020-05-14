// https://docs.cypress.io/api/introduction/api.html

describe('Enter tournament', () => {
  beforeEach(function visitRootPage() {
    cy.visit('/enter-tourney')
  })

  it('Should have game pin input and name input', () => {
    cy.get('[data-cy=game-pin]').should('be.visible').type('1923', { delay: 35 })
    cy.get('[data-cy=player-name]').should('be.visible').type('Cypress test player', { delay: 35 })
  })

  it('Should have cancel button that navigates home', () => {
    cy.get('[data-cy=cancel]').click()
    cy.location('pathname').should('eq', '/')
  })
})
