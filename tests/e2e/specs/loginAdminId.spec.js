// https://docs.cypress.io/api/introduction/api.html

describe('Login with admin id', () => {
  beforeEach(function visitRootPage() {
    cy.visit('/enter-AID')
  })

  it('Should have admin id input', () => {
    cy.get('[data-cy=adminId]').should('be.visible').type('fsa32', { delay: 35 })
  })

  it('Should have cancel button that navigates home', () => {
    cy.get('[data-cy=cancel]').click()
    cy.location('pathname').should('eq', '/')
    cy.wait(500)
  })
})
