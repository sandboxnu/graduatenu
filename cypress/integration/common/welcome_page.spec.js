// to launch test runner: yarn run cypress open

describe("Welcome page", () => {
  it("test login via UI as student", () => {
    cy.visit("/");
    cy.get("button")
      .contains("Dev Bypass (Student)")
      .click();
    cy.url().should("include", "/redirect");
    // check logged in
    cy.url({ timeout: 300000 }).should("include", "/home");
    // check "Logout" button visible to further indicate signed in
    cy.get("button")
      .contains("Logout")
      .should("exist");
  });

  it("test logout student", () => {
    cy.studentLogin();
    // logout
    cy.get("button")
      .contains("Logout")
      .click();
    // check logged out
    cy.url().should("eq", "http://localhost:3000/"); // => true
  });

  it("test Get Started redirects to Khoury admin page", () => {
    cy.visit("/");
    cy.get('[data-cy="get-started"]')
      .get("button")
      .contains("Get Started");

    cy.get('[data-cy="get-started"]').should(
      "have.attr",
      "href",
      "https://admin.khoury.northeastern.edu"
    );
  });
});
