describe("Assessing the functionalities of the template subsection within the Admin Panel.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Kennung"]').clear().type("test01");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/admin");
    cy.wait(1000);
  });

  it("Should create a new Protocol Template", () => {
    cy.get("a:contains('Protokollvorlagen')", { timeout: 10000 }).should(
      "exist"
    );

    cy.wait(500);
    cy.contains("Protokollvorlagen")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/template");

    cy.wait(2000);

    cy.get(".rounded-xl").then(($element) => {
      if ($element.text().includes("Frontend Testing")) {
        cy.log('Der Text "Frontend Testing" wurde gefunden.');

        const index = $element.length - 3;

        cy.get(".rounded-xl .MuiSvgIcon-root").eq(index).click();

        cy.get(".rounded-xl")
          .children()
          .children()
          .should("not.contain", "Frontend Testing");

        cy.contains("Speichern").click();
        cy.wait(2000);
        cy.reload();
      } else {
        cy.log(
          'Der Text "Frontend Testing" wurde nicht gefunden. Test wird ausgeführt.'
        );
      }
      cy.get('svg[data-testid="AddIcon"]').click();

      cy.get('input[placeholder="Neue Vorlage"]')
        .clear()
        .type("Frontend Testing");

      cy.get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.mr-2").last().click();

      cy.get(".w-md-editor-text-input")
        .clear()
        .type(
          "Das ist der einzige valide Test, den wir hier schreiben werden!"
        );

      cy.contains("Speichern").click();

      cy.get(".Toastify").should("contain", "Erfolgreich!");
    });
  });

  it("Should create a new protocol template, but with an error because the template already exists", () => {
    cy.get("a:contains('Protokollvorlagen')", { timeout: 10000 }).should(
      "exist"
    );

    cy.contains("Protokollvorlagen")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/template");

    cy.get('svg[data-testid="AddIcon"]').click();

    cy.get('input[placeholder="Neue Vorlage"]')
      .clear()
      .type("Frontend Testing");

    cy.get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.mr-2").last().click();

    cy.get(".w-md-editor-text-input")
      .clear()
      .type("Das ist der einzige valide Test, den wir hier schreiben werden!");

    cy.contains("Speichern").click();

    cy.get(".Toastify").should(
      "contain",
      'Fehlgeschlagen: {"message":"The request contains duplicate titles. Duplicate values are not allowed."}'
    );
  });
});
