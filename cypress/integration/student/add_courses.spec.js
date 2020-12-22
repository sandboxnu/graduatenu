describe("add course in home page", () => {
  beforeEach(() => {
    cy.studentLogin();
  });

  it("should be able to add a class to first semester", () => {
    cy.get('[data-cy="add-class-div"]')
      .first()
      .click();

    cy.get('[data-cy="search-input"]').type("CS 2500 {enter}");
    cy.get('[data-cy="results-add-class-button"]', {
      timeout: 30000, // wait up to 30 seconds for class to load
    })
      .should("be.visible")
      .first()
      .click();

    cy.get("button")
      .contains("Add Classes")
      .should("not.be.disabled")
      .click();

    cy.get('[data-cy="class-list-wrapper"]');
  });
  /*
  it("should get warning when adding duplicates", () => {
    cy.visit("/");
    cy.get("button")
      .contains("Dev Bypass")
      .click();
    cy.url({
      timeout: 30000,
    }).should("include", "/home"); // wait up to 30 seconds to load the home screen
    // click add class
    cy.get(
      ":nth-child(3) > .sc-kjoXOD > :nth-child(4) > .sc-fAjcbJ > .sc-caSCKo > .sc-hSdWYo > .MuiPaper-root > .sc-hzDkRC > .sc-jhAzac"
    ).click();
    // type in "CS" and "2500"
    cy.get(
      '[style="margin-top: 36px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("CS");
    cy.get(
      '[style="margin-top: 12px; margin-bottom: 12px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("2500");
    // search
    cy.get('.sc-kpOJdX > [tabindex="0"]').click();
    cy.get(".sc-jKJlTe > .MuiPaper-root > .sc-kGXeez > .sc-jzJRlG", {
      timeout: 30000, // wait up to 30 seconds for class to show up
    }).should("be.visible");
    // click Add Class button
    cy.get(".sc-kpOJdX > :nth-child(6)").click();
    // click add class
    cy.get(
      ":nth-child(3) > .sc-kjoXOD > :nth-child(4) > .sc-fAjcbJ > .sc-caSCKo > .sc-hSdWYo > .MuiPaper-root > .sc-hzDkRC > .sc-jhAzac"
    ).click();
    // type in "CS" and "2500"
    cy.get(
      '[style="margin-top: 36px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("CS");
    cy.get(
      '[style="margin-top: 12px; margin-bottom: 12px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("2500");
    // search
    cy.get('.sc-kpOJdX > [tabindex="0"]').click();
    cy.get(".sc-jKJlTe > .MuiPaper-root > .sc-kGXeez > .sc-jzJRlG", {
      timeout: 30000, // wait up to 30 seconds for class to show up
    }).should("be.visible");
    // warning should show
    cy.get(".sc-hMqMXs").should(
      "contain",
      "Fundamentals of Computer Science 1 already exists in your schedule"
    );
  });

  it("should be able to delete class after adding it", () => {
    cy.visit("/");
    cy.get("button")
      .contains("Dev Bypass")
      .click();
    cy.url({
      timeout: 30000,
    }).should("include", "/home"); // wait up to 30 seconds to load the home screen
    // click add class
    cy.get(
      ":nth-child(3) > .sc-kjoXOD > :nth-child(4) > .sc-fAjcbJ > .sc-caSCKo > .sc-hSdWYo > .MuiPaper-root > .sc-hzDkRC > .sc-jhAzac"
    ).click();
    // type in "CS" and "2500"
    cy.get(
      '[style="margin-top: 36px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("CS");
    cy.get(
      '[style="margin-top: 12px; margin-bottom: 12px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("2500");
    // search
    cy.get('.sc-kpOJdX > [tabindex="0"]').click();
    cy.get(".sc-jKJlTe > .MuiPaper-root > .sc-kGXeez > .sc-jzJRlG", {
      timeout: 30000, // wait up to 30 seconds for class to show up
    }).should("be.visible");
    // click Add Class button
    cy.get(".sc-kpOJdX > :nth-child(6)").click();
    cy.get(
      ":nth-child(4) > .sc-fAjcbJ > .sc-caSCKo > .sc-hSdWYo > :nth-child(1) > .MuiPaper-root > .sc-cMljjf > .sc-jzJRlG"
    ).should("exist");
    // mouse over class
    cy.get(
      ":nth-child(4) > .sc-fAjcbJ > .sc-caSCKo > .sc-hSdWYo > :nth-child(1) > .MuiPaper-root"
    ).trigger("mouseover");
    // delete!
    cy.get(
      "#root > div > div.sc-iuJeZd.dxSiWj.hide-scrollbar > div > div:nth-child(3) > div.sc-kjoXOD.ivoNhl > div:nth-child(4) > div.sc-fAjcbJ.ehaiRc > div > div > div:nth-child(1) > div > div > div > div:nth-child(2) > button > span > svg > path"
    ).click();
    // snack bar message for deletion
    cy.get(".MuiSnackbarContent-message").should("be.visible");
    cy.get(".MuiSnackbarContent-message").contains(
      "Removed CS2500: Fundamentals of Computer Science 1"
    );
    cy.get(
      ":nth-child(4) > .sc-fAjcbJ > .sc-caSCKo > .sc-hSdWYo > :nth-child(1) > .MuiPaper-root > .sc-cMljjf > .sc-jzJRlG"
    ).should("not.exist");
  });
  it("should add multiple classes to transfer credit", () => {
    cy.visit("/");
    cy.get("button")
      .contains("Dev Bypass")
      .click();
    cy.url({
      timeout: 30000,
    }).should("include", "/home"); // wait up to 30 seconds to load the home screen
    // click add class in transfer
    cy.get(".sc-hmzhuo > .sc-bRBYWo > .sc-hzDkRC > .sc-jhAzac").click();
    // type in "CS" and "2500"
    cy.get(
      '[style="margin-top: 36px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("CS");
    cy.get(
      '[style="margin-top: 12px; margin-bottom: 12px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("2500");
    // search
    cy.get('.sc-kpOJdX > [tabindex="0"]').click();
    cy.get(".sc-jKJlTe > .MuiPaper-root > .sc-kGXeez > .sc-jzJRlG", {
      timeout: 30000, // wait up to 30 seconds for class to show up
    }).should("be.visible");
    // add another!
    cy.get(
      '[style="margin-top: 12px; margin-bottom: 12px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).clear();
    cy.get(
      '[style="margin-top: 12px; margin-bottom: 12px; min-width: 326px;"] > .MuiInputBase-root > #outlined-basic'
    ).type("3500");
    cy.get(".sc-kpOJdX > :nth-child(4)").click();
    cy.get(":nth-child(2) > .sc-kGXeez > .sc-jzJRlG", {
      timeout: 30000,
    }).should("contain", "CS3500");
    // click Add Class button
    cy.get(".sc-kpOJdX > :nth-child(6)").click();
    cy.get(":nth-child(1) > .MuiPaper-root > .sc-kGXeez > .sc-jzJRlG").should(
      "exist"
    );
    cy.get(":nth-child(2) > .MuiPaper-root > .sc-kGXeez > .sc-jzJRlG").should(
      "exist"
    );
  });*/
});
