// https://docs.cypress.io/api/introduction/api.html

function fillOutForm() {
  cy.get('[data-cy=name]').type('Cypress tournament')
  cy.get('[data-cy=email]').type('Sjakkarena_testemail@test.com')
  fillOutTime()
  cy.get('[data-cy=tables]').type('10')
  cy.get('[data-cy=rounds]').type('12')
}

function fillOutTime() {
  cy.get('[data-cy=time-input]').click()
  cy.get('[data-cy=time-picker]').should('be.visible')
  selectTime()
}

function selectTime() {
  cy.wait(500)
  cy.get('[style="left: 23.1532%; top: 65.5%;"]').should('be.visible').click()
  cy.wait(500)
  cy.get('[style="left: 50%; top: 100%;"]').should('be.visible').click()
}

describe('Tournament creation form', () => {
  beforeEach(function visitRootPage() {
  })

  it('Should display time component when time input is clicked and set correct value', () => {
    cy.visit('/tournament-creation')
    fillOutTime()
    cy.get('[data-cy=time-input]').should('have.value', '20:30')
  })

  it('Should fill the form and clear the form with clear button', () => {
    cy.get('[data-cy=clear]').click()
    fillOutForm()
    cy.get('[data-cy=clear]').click()
    cy.get('[data-cy=name]').should('have.value', '')
    cy.get('[data-cy=email]').should('have.value', '')
    cy.get('[data-cy=tables]').should('have.value', '')
    cy.get('[data-cy=rounds]').should('have.value', '')
    cy.get('[data-cy=time-input]').should('have.value', '')
  })

  it('Cancel should route to home page', () => {
    cy.get('[data-cy=cancel]').click()
    cy.location('pathname').should('eq', '/')
  })

  it('Should reveal a date time input field', () => {
    cy.visit('/tournament-creation')
    cy.get('[data-cy="endtime-switch"]').parent().click()
    cy.get('[data-cy="endtime"]').should('be.visible')
  })

  it('Should select right year, date and time', () => {
    cy.get('[data-cy="dateTimeInput"]').click()
    cy.wait(500)
    cy.get('.v-date-picker-title__year').should('be.visible').click()
    cy.wait(500)
    cy.get('.v-date-picker-years').contains('2024').click()
    cy.wait(500)
    cy.get('tbody > :nth-child(2) > :nth-child(2)').click()
    cy.wait(500)
    cy.get(':nth-child(3) > :nth-child(4)').click()
    cy.wait(500)
    cy.get('.v-picker__actions > :nth-child(1)').click()
    cy.wait(500)
    selectTime()
    cy.get('[data-cy="dateTimeInput"]').should('have.value', '2024-05-15  20:30')
  })
})
