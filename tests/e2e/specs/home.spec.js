// https://docs.cypress.io/api/introduction/api.html

describe('', () => {
  beforeEach(function visitRootPage() {
    cy.visit('/')
  })

  it('All navigation should be visible', () => {
    cy.get('[data-cy=play]').contains('Spill turnering').should('be.visible')
    cy.get('[data-cy=create-torunament]').contains('Opprett turnering').should('be.visible')
    cy.get('[data-cy=login-adminID]').contains('Logg på med adminID').should('be.visible')
    cy.get('[data-cy=help] > .router-link').contains('Hjelp').should('be.visible')
    cy.get('[data-cy=about] > .router-link').contains('Om Sjakkarena').should('be.visible')
    cy.get('[data-cy=chess-clock] > .router-link').contains('Sjakkur').should('be.visible')
  })

  it('Play navigates to enter-tourney', () => {
    cy.get('[data-cy=play]').click()
    cy.location('pathname').should('eq', '/enter-tourney')
    cy.wait(1000)
  })

  it('Create-tournament navigates to tournament-creation', () => {
    cy.get('[data-cy=create-torunament]').click()
    cy.location('pathname').should('eq', '/tournament-creation')
    cy.wait(1000)
  })

  it('Login-adminID navigates to enter-AID', () => {
    cy.get('[data-cy=login-adminID]').click()
    cy.location('pathname').should('eq', '/enter-AID')
    cy.wait(1000)
  })

  it('Help in footer opens new tab', () => {
    cy.get('a[href="/help"]').should('have.attr', 'target', '_blank')
  })

  it('About in footer opens new tab', () => {
    cy.get('a[href="/about"]').should('have.attr', 'target', '_blank')
  })

  it('Chess-clock in footer opens new tab', () => {
    cy.get('a[href="/chess-clock"]').should('have.attr', 'target', '_blank')
  })
})
