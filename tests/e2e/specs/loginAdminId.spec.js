
describe('Login with admin id', () => {
  beforeEach(function visitRootPage() {
    cy.visit('/enter-AID')
  })

  it('Should have admin id input and submit button', () => {
    cy.get('[data-cy=adminId]').should('be.visible').type('ugKon', { delay: 35 })
    cy.get('[data-cy="submit"]')
  })

  it('Should have cancel button that navigates home', () => {
    cy.get('[data-cy=cancel]').click()
    cy.location('pathname').should('eq', '/')
    cy.wait(500)
  })

  it('Should show loading circle, then error message with entered adminId, then hide error circle', () => {
    cy.get('[data-cy=adminId]').should('be.visible').type('abcdefg1234')
    cy.get('[data-cy="submit"]').click()
    let circle = cy.get('[data-cy=loadingCircle]')
    circle.should('be.visible')
    cy.wait(2000)
    cy.get('#error').should('be.visible').contains('abcdefg1234')
    cy.get('[data-cy=loadingCircle]').should('not.be.visible')
  })

  it('Should route to the correct page with game-pin as a part of the  path', () => {
    cy.window().should('have.property', '__store')
    cy.get('[data-cy=adminId]').should('be.visible').type('ugKon', { delay: 35 })
    cy.get('[data-cy="submit"]').click()
    cy.location('pathname').should('eq', '/tournament/530508')
    cy.scrollTo('bottom', { duration: 1500 })
    cy.scrollTo('top', { duration: 1500 })
  })
})
