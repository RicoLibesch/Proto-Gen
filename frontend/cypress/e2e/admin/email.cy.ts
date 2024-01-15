describe("Assessing the functionalities of the email subsection within the Admin Panel.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[placeholder="Kennung"]').clear().type("test");
    cy.get('input[placeholder="Passwort"]').clear().type("test");
    cy.get('button:contains("Login")').first().click();

    cy.visit("http://localhost:3000/admin");
    cy.wait(1000);
  });

  it("Should add new email reciver.", () => {
    cy.intercept("PUT", "http://localhost:8080/api/mails/receiver").as(
      "apiRequest"
    );

    cy.get("a:contains('E-Mail')", { timeout: 10000 }).should("exist");

    cy.wait(500);
    cy.contains("E-Mail")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/email");

    cy.get(".col-span-1").eq(0).find('svg[data-testid="AddIcon"]').click();

    const newReceiver = "example@mail.example";
    cy.get(
      "input.ml-2.bg-transparent.border-none.focus\\:outline-none.w-full"
    ).type(newReceiver);

    cy.get(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.mr-2")
      .should("be.visible")
      .first()
      .click();

    cy.get('button:contains("Speichern")').first().click();

    cy.wait("@apiRequest").its("response.statusCode").should("eq", 200);

    cy.reload({ timeout: 5000 }).then(() => {
      cy.get(".rounded-full.border.border-neutral span").should(
        "contain",
        newReceiver
      );
    });
  });

  it("All components in the email receiver edit should be fully functional", () => {
    cy.intercept("PUT", "http://localhost:8080/api/mails/templates").as(
      "apiTemplates"
    );
    cy.intercept("PUT", "http://localhost:8080/api/mails/dispatch").as(
      "apiDispatch"
    );

    cy.get("a:contains('E-Mail')", { timeout: 10000 }).should("exist");

    cy.contains("E-Mail")
      .click()
      .url()
      .should("eq", "http://localhost:3000/admin/email");

    cy.get('input[type="checkbox"]')
      .should("be.checked")
      .then(($checkbox) => {
        if (!$checkbox.prop("checked")) {
          cy.get('input[type="checkbox"]').check().check();
        }
      });

    cy.get('input[type="checkbox"]').should("be.checked");

    const referenceText = "Neuer Betreff";
    cy.get('input[type="text"]').eq(0).clear().type(referenceText);

    const bodyText = "Ein neuer Text für den Editor";
    cy.get(".cm-content").clear().type(bodyText);

    cy.get('button:contains("Speichern")').first().click();

    cy.wait("@apiTemplates").its("response.statusCode").should("eq", 200);

    cy.wait("@apiDispatch").its("response.statusCode").should("eq", 200);

    cy.reload();

    cy.get('input[type="text"]').should("contain.value", referenceText);

    cy.get(".cm-content").should("contain.text", bodyText);
  });
});
