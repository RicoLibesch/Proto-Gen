describe("Assessing the functionalities of the roles subsection within the Admin Panel.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Kennung"]').clear().type("test");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/admin");
    cy.wait(1000);
  });

  it("Should add user 'test2' to administrators and scribes.", () => {
    cy.get("a:contains('Rechtevergabe')", { timeout: 10000 }).should("exist");

    cy.wait(500);
    cy.contains("Rechtevergabe")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/roles");

    cy.get(".col-span-1")
      .eq(0)
      .find('.MuiSvgIcon-root[data-testid="AddIcon"]')
      .click();

    cy.get(".rounded-full.border.border-neutral input").type("test2");

    cy.get(
      '.rounded-full.border.border-neutral [data-testid="CheckIcon"]'
    ).click();

    cy.get(".col-span-1")
      .eq(1)
      .find('.MuiSvgIcon-root[data-testid="AddIcon"]')
      .click();

    cy.get(".rounded-full.border.border-neutral input").type("test2");

    cy.get(
      '.rounded-full.border.border-neutral [data-testid="CheckIcon"]'
    ).click();

    cy.get(".Toastify").should("contain", "Erfolgreich!");

    cy.reload();
  });
});
