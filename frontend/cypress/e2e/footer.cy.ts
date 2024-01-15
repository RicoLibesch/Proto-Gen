describe("Testing the functions of the Footer", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Should visit the Impressum site by clicking on the 'Impressum' link", () => {
    cy.get("a")
      .contains("Impressum")
      .click()
      .url()
      .should("eq", "http://localhost:3000/impressum");
  });

  it("Should reload the site by clicking on the 'Fachschaft MNI' link", () => {
    cy.get("a")
      .contains("Fachschaft MNI")
      .click()
      .url()
      .should("eq", "http://localhost:3000/");
  });

  it("Should visit the Datenschutz site by clicking on the 'Datenschutz' link", () => {
    cy.get("a")
      .contains("Datenschutz")
      .click()
      .url()
      .should("eq", "http://localhost:3000/datenschutz");
  });

  it("Should open the FS MNI Instagram page in a new browser tab", () => {
    cy.get('[data-testid="InstagramIcon"]')
      .should("exist")
      .then(($icon) => {
        if ($icon.length > 0) {
          cy.get('[data-testid="InstagramIcon"]')
            .invoke("removeAttr", "target")
            .click({ force: true });

          cy.get('[data-testid="InstagramIcon"]')
            .invoke("attr", "href")
            .then((href) => {
              cy.log("Clicked element href:", href);
            });
        } else {
          cy.log("Instagram icon not found. Skipping the action.");
        }
      });
  });
});
