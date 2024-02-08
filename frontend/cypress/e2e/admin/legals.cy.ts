describe("Assessing the functionalities of the legals subsection within the Admin Panel.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Kennung"]').clear().type("test01");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/admin");
    cy.wait(1000);
  });

  it("Should add Imprint and privacy policy", () => {
    cy.get("a:contains('Gesetzliches')", { timeout: 10000 }).should("exist");

    cy.wait(500);
    cy.contains("Gesetzliches")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/legals");

    const testText =
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ";
    cy.get("textarea.w-md-editor-text-input").eq(0).clear().type(testText);

    cy.get("textarea.w-md-editor-text-input").eq(1).clear().type(testText);
    cy.get('button:contains("Speichern")').click();

    cy.wait(500);
    cy.reload()

    cy.get("textarea.w-md-editor-text-input")
      .eq(0)
      .should("contain.text", testText);

    cy.get("textarea.w-md-editor-text-input")
      .eq(1)
      .should("contain.text", testText);
  });
});
