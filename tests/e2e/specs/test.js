// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('http://localhost:8080/#/lobby')
    cy.wait(3000)
    cy.get('#player0').trigger('mouseover')
    cy.wait(3000)
    cy.get('#player0').click()
    cy.wait(1000)
    cy.get('#player0').click()
  })
})
