describe('Basic app smoke', () => {
  it('loads the home page', () => {
    cy.visit('/')
    cy.contains('Regenerative Carbon Credit Marketplace')
  })
})
