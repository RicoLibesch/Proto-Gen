describe("Assessing the functionalities of the others subsection within the Admin Panel.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Kennung"]').clear().type("test01");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/admin");
    cy.wait(1000);
  });

  it("Social media channels are being populated and saved with links.", () => {
    cy.get("a:contains('Weiteres')", { timeout: 10000 }).should("exist");

    cy.wait(500);
    cy.contains("Weiteres")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/others");

    cy.get('input[placeholder="webname"]').clear().type("Webname");
    cy.get('input[placeholder="facebook"]')
      .clear()
      .type("https://www.facebook.com/example");
    cy.get('input[placeholder="instagram"]')
      .clear()
      .type("https://www.instagram.com/example");
    cy.get('input[placeholder="twitter"]')
      .clear()
      .type("https://www.twitter.com/example");
    cy.get('input[placeholder="git"]')
      .clear()
      .type("https://www.github.com/example");
    cy.get('input[placeholder="meeting-room"]')
      .clear()
      .type("https://www.meeting-room.com");

    cy.get('button:contains("Speichern")').eq(0).click();

    cy.get(".Toastify").should("contain", "Erfolgreich!");
  });

  it("Should create a new group of Person for the Attendance List", () => {
    cy.get("a:contains('Weiteres')", { timeout: 10000 }).should("exist");

    cy.contains("Weiteres")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/others");

    cy.get(".col-span-1").eq(2).find('svg[data-testid="AddIcon"]').click();

    cy.get(
      "input.ml-2.bg-transparent.border-none.focus\\:outline-none.w-full"
    ).first().type("Alumni");

    cy.get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.mr-2")
      .should("be.visible")
      .last()
      .click();

    cy.get('button:contains("Speichern")').eq(1).click();

    cy.get(".Toastify").should("contain", "Erfolgreich!");
  });

  it('Should delete the "Alumni" category', () => {
    cy.get("a:contains('Weiteres')", { timeout: 10000 }).should("exist");

    cy.contains("Weiteres")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/others");

    cy.get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.mr-2").last().click();

    cy.get('button:contains("Speichern")').eq(1).click();

    cy.get(".Toastify").should("contain", "Erfolgreich!");
  });
});
