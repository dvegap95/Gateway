
//guarantee (almost) that vendor won't already exists
const vendor = "_v-" + Date.now();

//find a card containing the text in one of it's main fields
Cypress.Commands.add("findDeviceCardByText", (text) => {
  return cy.findByText(text).parent().parent();
});

describe("peripheral devices tests", () => {
  before(() => {
    cy.visit("/peripheral-devices");
  });
  describe("create peripheral device", () => {
    it("opens create device dialog", () => {
      cy.findByTestId("peripheral_device_add_card").click();
      cy.findByText("Create device").should("exist");
    });
    it("validates uid", () => {
      cy.findAllByLabelText("UID").type("aa");
      cy.findByText("Value must be an Integer").should("exist");
      cy.findByText("Accept").should("be.disabled");
      cy.findAllByLabelText("UID").type("123");
      cy.findByText("Value must be an Integer").should("not.exist");
      cy.findByText("Accept").should("not.be.disabled");
    });
    it("creates periphearal device", () => {
      cy.findByLabelText("Vendor").type(vendor);
      cy.findByText("Accept").should("not.be.disabled"); //field is valid (has no validation)

      cy.findByLabelText("Status").click(); //open status selector menu
      cy.findByText("online").click(); //select online
      cy.findByText("online").should("not.exist"); //additionally check menu closing properly

      cy.findByText("Accept").click(); //click accept

      cy.findByText("Successfully created!").should("exist"); //success notification
      cy.findByText("Create device").should("not.exist"); //dialog closed
      cy.findByText("vendor: " + vendor).should("exist"); //actual device card exists
      cy.findDeviceCardByText("vendor: " + vendor)
        .findByText("123")
        .should("exist"); //actual device card exists locally
      cy.reload();
      cy.findDeviceCardByText("vendor: " + vendor)
        .findByText("123")
        .should("exist"); //actual device card exists in backend
    });

    it("edits peripheral device", () => {
      cy.findDeviceCardByText("vendor: " + vendor)
        .findByTestId("edit_btn")
        .click(); //click edit button in the test card

      cy.findByText("Edit device").should("exist"); //edit dialog opens

      cy.findByLabelText("UID").type("45");

      cy.findByText("Accept").click(); //click accept

      cy.findByText("Successfully edited!").should("exist"); //success notification
      cy.findByText("Create device").should("not.exist"); //dialog closed
      cy.findByText("vendor: " + vendor).should("exist"); //actual device card exists
      cy.findDeviceCardByText("vendor: " + vendor)
        .findByText("12345")
        .should("exist"); //actual device card edited locally
      cy.reload();
      cy.findDeviceCardByText("vendor: " + vendor)
        .findByText("12345")
        .should("exist"); //actual device card edited in backend
    });
    it("deletes peripheral device", () => {
      cy.findDeviceCardByText("vendor: " + vendor)
        .findByTestId("delete_btn")
        .click(); //click delete button in the test card
      cy.findByText("Confirm").click(); //click confirm delete
      cy.findByText("vendor: " + vendor).should("not.exist"); //check delete locally
      cy.reload();
      cy.findByText("vendor: " + vendor).should("not.exist"); //check delete in backend
    });
  });
});
