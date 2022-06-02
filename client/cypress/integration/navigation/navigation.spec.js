describe("navigation tests", () => {
  it("navigates by buttons and links", () => {
    cy.visit("/");
    cy.findByText("Table of content").should("exist");
    cy.findAllByText("Gateways").click();
    cy.findByTestId("gateway_add_card").should("exist");
    cy.findAllByText("Peripheral Devices").click();
    cy.findByTestId("peripheral_device_add_card").should("exist");

    cy.findAllByText("Home").click();
    cy.findByText("Gateways CRUD").click();
    cy.findByTestId("gateway_add_card").should("exist");

    cy.findAllByText("Home").click();
    cy.findByText("Peripheral devices CRUD").click();
    cy.findByTestId("peripheral_device_add_card").should("exist");
  });
  it("navigates by nav bar (react router)", () => {
    cy.visit("/");
    cy.findByText("Table of content").should("exist");

    cy.visit("/gateways");
    cy.findByTestId("gateway_add_card").should("exist");

    cy.visit("/peripheral-devices");
    cy.findByTestId("peripheral_device_add_card").should("exist");
  });
});
