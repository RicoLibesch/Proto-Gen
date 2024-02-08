describe("Toggle Rights.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Kennung"]').clear().type("test01");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/admin");
    cy.wait(1000);
  });

  it("Should add user 'test01' to administrators and scribes.", () => {
    cy.get("a:contains('Rechtevergabe')", { timeout: 10000 }).should("exist");

    cy.wait(500);
    cy.contains("Rechtevergabe")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/roles");
    cy.wait(1500);
    cy.get("input[type=checkbox]").last().click();
    cy.wait(500);

    cy.get(".Toastify").should("contain", "Erfolgreich!");

    cy.wait(1500);
    cy.get("input[type=checkbox]").last().click();
    cy.wait(500);

    cy.get(".Toastify").should("contain", "Erfolgreich!");
    cy.reload();
  });
});
