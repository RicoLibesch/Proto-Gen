describe("Testing the functions of the New section", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Kennung"]').clear().type("test01");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/");
    cy.wait(1000);
  });

  it("create a new protocol with no updated content so it shouldnt create a new protocol", () => {
    cy.wait(2000);

    cy.get("a:contains('Neu')", { timeout: 10000 }).should("exist");

    cy.contains("Neu").click().url().should("eq", "http://localhost:3000/new");

    cy.wait(2000);

    cy.get('button:contains("Fertigstellen")').first().click();

    cy.wait(1000);
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Protokoll ist leer!");
    });
    cy.on("window:confirm", () => true);
  });

  it("create a new protocol with updated content so it should create a new protocol", () => {
    cy.get("a:contains('Neu')", { timeout: 10000 }).should("exist");

    cy.contains("Neu").click().url().should("eq", "http://localhost:3000/new");

    cy.get(".w-md-editor-text-input")
      .clear()
      .type(
        "Eröffnung durch test\n" +
          "Protokoll geschrieben von test\n" +
          "# Top 0 Genehmigung des Protokolls der letzten Sitzung\n" +
          "# Top 1 Termine\n" +
          "# Top 2 Gäste\n" +
          "# Top 3 Post und E-Mails\n" +
          "  - Post\n" +
          "  - E-Mails\n" +
          "# Top 4 Mitteilungen\n" +
          "# Top 5 Rückblick\n" +
          "# Top 6 Gremien und Ausschüsse\n" +
          "# Top 7 Aufgaben\n" +
          "  - Offen\n" +
          "  - Erledigt\n" +
          "# Top 8 Finanzen\n" +
          "# Top 9 Sonstige Themen\n"
      );

    cy.get('button:contains("Fertigstellen")').first().click();

    cy.get(".Toastify").should("contain", "Erfolgreich!");
  });

  it("create a new protocol with updated content so it should create a new protocol with the type TestProtokoll", () => {
    cy.get("a:contains('Neu')", { timeout: 10000 }).should("exist");

    cy.contains("Neu").click().url().should("eq", "http://localhost:3000/new");

    cy.get(".w-md-editor-text-input")
      .clear()
      .type(
        "Eröffnung durch test\n" +
          "Protokoll geschrieben von test\n" +
          "# Top 0 Genehmigung des Protokolls der letzten Sitzung\n" +
          "# Top 1 Termine\n" +
          "# Top 2 Gäste\n" +
          "# Top 3 Post und E-Mails\n" +
          "  - Post\n" +
          "  - E-Mails\n" +
          "# Top 4 Mitteilungen\n" +
          "# Top 5 Rückblick\n" +
          "# Top 6 Gremien und Ausschüsse\n" +
          "# Top 7 Aufgaben\n" +
          "  - Offen\n" +
          "  - Erledigt\n" +
          "# Top 8 Finanzen\n" +
          "# Top 9 Sonstige Themen\n"
      );

    cy.get('button:contains("Fertigstellen")').first().click();

    cy.get(".Toastify").should("contain", "Erfolgreich!");
  });

  it("create a new protocol with updated content and a person in a section", () => {
    const dataTransfer = new DataTransfer();
    const txt = "Lorem ipsum";
    dataTransfer.setData("text/plain", txt);

    cy.get("a:contains('Neu')", { timeout: 10000 }).should("exist");

    cy.contains("Neu").click().url().should("eq", "http://localhost:3000/new");

    cy.get(".w-md-editor-text-input").clear().type(txt);

    cy.get(".rounded-xl").children().last();

    cy.get('[data-testid="AddIcon"]').click();

    cy.get('[placeholder="Vorname Nachname"').type(txt);

    cy.get(
      '.rounded-full.border.border-neutral [data-testid="CheckIcon"]'
    ).click();

    cy.get(
      ".rounded-full.border.border-neutral.flex.items-center.overflow-hidden.m-1"
    )
      .trigger("mousedown")
      .trigger("dragstart", {
        dataTransfer: dataTransfer,
      });

    cy.contains("Vollmitglieder")
      .parent()
      .find(".flex.flex-wrap")
      .trigger("dragenter", {
        dataTransfer: dataTransfer,
      })
      .trigger("dragover", {
        dataTransfer: dataTransfer,
      })
      .trigger("drop", {
        dataTransfer: dataTransfer,
      });

    cy.get(
      ".rounded-full.border.border-neutral.flex.items-center.overflow-hidden.m-1"
    )
      .trigger("dragend", {
        dataTransfer: dataTransfer,
      })
      .trigger("mouseup");

    cy.get('button:contains("Fertigstellen")').first().click();

    cy.get(".Toastify").should("contain", "Erfolgreich!");
  });
});
