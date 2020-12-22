// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// TODO: this builds up state
// need to create new user each time
Cypress.Commands.add("studentLogin", () => {
  cy.request({
    method: "POST",
    url: "/api/v1/admin_hook",
    body: JSON.stringify({
      email: "a.grob@northeastern.edu",
      nu_id: "001234567",
      is_advisor: false,
      major: "Computer Science, BSCS",
      first_name: "Alexander",
      last_name: "Grob",
      courses: [],
      photo_url:
        "https://prod-web.neu.edu/wasapp/EnterprisePhotoService/PhotoServlet?vid=CCS&er=d1d26b1327817a8d34ce75336e0334cb78f33e63cf907ea82da6d6abcfc15d66244bb291baec1799cf77970e4a519a1cf7d48edaddb97c01",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => {
    cy.visit(response.body.redirect);
    cy.url().should("match", /home/);
  });
});
