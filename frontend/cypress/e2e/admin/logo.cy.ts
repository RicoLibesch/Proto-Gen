describe("Assessing the functionalities of the logo subsection within the Admin Panel.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Kennung"]').clear().type("test");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/admin");
    cy.wait(1000);
  });

  it("Should not upload a new logo and instead display the message 'Kein Logo ausgewählt!'", () => {
    cy.get("a:contains('Logo editieren')", { timeout: 10000 }).should("exist");

    cy.wait(500);
    cy.get("a:contains('Logo editieren')").click();

    cy.get('button:contains("Hochladen")').click();

    cy.get(".Toastify").should("contain", "Kein Logo ausgewählt!");
  });
});
