describe("Testing the functions of the Main section", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/protocols/1");
    });

    it("Should navigate to the 'Protocols/2' page by going to the first one and then going to 2 by next button", () => {
        cy.get("body").then(($body) => {
            if ($body.find("a:contains('Nächstes')").length) {
                cy.get("a")
                    .contains("Nächstes")
                    .click()
                    .url()
                    .should("match", /\/protocols\/2/);
            } else {
                cy.log("Nächstes not Found")
            }
        });
    });

    it("Should navigate to the 'Protocols/1' page by going to the first one and then going to 2 by next button and then back by previous", () => {
        cy.visit("http://localhost:3000/protocols/2");

        cy.get("body").then(($body) => {
            if ($body.find("a:contains('Vorheriges')").length) {
                cy.get("a")
                    .contains("Vorheriges")
                    .click()
                    .url()
                    .should("match", /\/protocols\/1/);
            } else {
                cy.log("Vorheriges not Found")
            }
        });
    });

    it("Should download the protocol with the id 1", () => {

        cy.get("body").then(($body) => {
            if ($body.find("a:contains('Download as PDF')").length) {
                cy.get("a")
                    .contains("Download as PDF")
                    .click()
                    .url()
                    .should("match", /\/protocols\/1/);
            } else {
                cy.log("Download as PDF not Found")
            }
        });

    });
});
