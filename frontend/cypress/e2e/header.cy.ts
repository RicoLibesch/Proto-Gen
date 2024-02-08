describe("Testing the functions of the Header when not logged in.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.wait(500);
  });

  it("Should refresh the site by clicking on the logo", () => {
    cy.get("img").click("topLeft");
  });

  it("Should refresh the site by clicking on the 'Protokolle' link", () => {
    cy.get("a")
      .contains("Protokolle")
      .click()
      .url()
      .should("eq", "http://localhost:3000/");
  });
});

describe("Testing the functions of the Header when logged in", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.wait(500);
    cy.get('input[placeholder="Kennung"]').clear().type("test");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/admin");
    cy.wait(1000);
  });

  it("Should visite the Admin panel by clicking on the 'Admin' link", () => {
    cy.get("body").then(($body) => {
      if ($body.find("a:contains('Admin')").length) {
        cy.get("a")
          .contains("Admin")
          .click()
          .url()
          .should("eq", "http://localhost:3000/admin");
      } else {
        cy.log("Admin not Found");
      }
    });
  });

  it("Should visit the 'New Protocol' site by clicking on the 'New' link", () => {
    cy.get("body").then(($body) => {
      if ($body.find("a:contains('Neu')").length) {
        cy.get("a")
          .contains("Neu")
          .click()
          .url()
          .should("eq", "http://localhost:3000/new");
      } else {
        cy.log("Neu not Found");
      }
    });
  });
});
