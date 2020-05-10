// https://docs.cypress.io/api/introduction/api.html

describe('Home page', () => {
  it('All navigation should be visible', () => {
    cy.visit('/help')
    cy.wait(500)
    cy.get('[data-cy=Vert]').should('be.visible')
    cy.get('[data-cy=Spiller]').should('be.visible')
    cy.get('[data-cy=Notifikasjoner]').should('be.visible')
  })

  it('Should show host help data', () => {
    cy.wait(500)
    cy.get(':nth-child(1) > .v-expansion-panel-header')
      .contains('Opprett Turnering')
      .should('be.visible')
      .click()
    cy.wait(500)
    cy.get('p').should('be.visible')
  })

  it('Should show player help data', () => {
    cy.get('[data-cy=Spiller]').click()
    cy.wait(500)
    cy.get(':nth-child(1) > .v-expansion-panel-header')
      .contains('Bli med i turnering')
      .should('be.visible')
      .click()
    cy.wait(500)
    cy.get('p').should('be.visible')
  })

  it('Should show browsers notifiaction tabs', () => {
    cy.get('[data-cy=Notifikasjoner]').click()
    cy.get('[data-cy="Mozilla Firefox"]').should('be.visible')
    cy.get('[data-cy="Google Chrome"]').should('be.visible')
    cy.get('[data-cy="Google Chrome (Mobil)"]').should('be.visible')
    cy.get('[data-cy="Samsung Internett (Mobil)"]').should('be.visible')
  })

  it('Should contain firefox title', () => {
    cy.get('[data-cy="Mozilla Firefox"]').click()
    cy.wait(500)
    cy.get('[data-cy="Mozilla Firefox"]').should('be.visible')
    cy.get('h1').contains('Firefox').should('be.visible')
  })

  it('Should contain Google chrome title', () => {
    cy.get('[data-cy="Google Chrome"]').should('be.visible').click()
    cy.wait(500)
    cy.get('h1').contains('Google Chrome').should('be.visible')
  })

  it('Should contain Google Chrome (mobil) title', () => {
    cy.get('[data-cy="Google Chrome (Mobil)"]').click()
    cy.wait(500)
    cy.get('h1').contains('Google Chrome (Mobil)').should('be.visible')
  })

  it('Should contain Samsung Internett (Mobil) title', () => {
    cy.get('[data-cy="Samsung Internett (Mobil)"]').should('be.visible').click()
    cy.wait(500)
    cy.get('h1').contains('Samsung Internett (Mobil)').should('be.visible')
  })
})
