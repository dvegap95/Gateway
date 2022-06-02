let mongoose = require("mongoose");
//guarantee (almost) that gatewayName won't already exists
const gatewayName = "_n-" + Date.now();

//find a gateway card containing the text in one of it's main fields
Cypress.Commands.add("findGatewayCardByText", (text) => {
  return cy.findByText(text).parent().parent();
});

let devices = [];
//data for peripheral device's fake backend so devices can be trackable
for (let i = 1; i < 11; i++) {
  devices.push({
    uid: i,
    vendor: "vendor" + i,
    created: new Date(),
    status: i % 3 ? "offline" : "online",
    _id: new mongoose.Types.ObjectId(),
  });
}

describe(" gateways tests", () => {
  before(() => {
    cy.visit("/gateways");
  });
  describe("gateway CRUD", () => {
    //intercept peripheral device's related requests
    beforeEach(() => {
      cy.intercept(
        {
          method: "GET",
          pathname: "/api/peripheral-devices*",
        },
        (req) => {
          req.reply(devices);
        }
      );
      cy.intercept(
        {
          method: "POST",
          pathname: "/api/peripheral-devices*",
        },
        (req) => {
          let device = {
            ...req.body,
            _id: mongoose.Types.ObjectId(),
          };
          devices.push(device);
          req.reply(device);
        }
      );
    });
    it("opens create gateway dialog", () => {
      cy.findByTestId("gateway_add_card").click();
      cy.findByText("Create gateway").should("exist");
    });
    it("validates ip", () => {
      cy.findAllByLabelText("IP").type("123.");
      cy.findByText("Invalid ip address").should("exist"); //invalid ip "123."
      cy.findByText("Accept").should("be.disabled");
      cy.findAllByLabelText("IP").type("1.1.1");
      cy.findByText("Invalid ip address").should("not.exist"); //valid ip "123.1.1.0"
      cy.findByText("Accept").should("not.be.disabled");
    });

    //"test gateway's devices edition before create it"
    it("adds an existent device", () => {
      cy.findByText("Add a device...").parent().click();
      cy.findByText("9 - vendor9").should("exist"); //show selection list menu (other devices exist)
      cy.findByText("3 - vendor3").click(); //select device with uid = 3
      cy.findByText("1 - vendor1").should("not.exist"); //hide menu again
      cy.findByTestId("add_btn").click(); //add device with uid = 3

      cy.findByText("Devices [1]").should("exist"); // the gateway has one device
      //added device now belongs to gateway's device list
      cy.findByTestId("scroll_view").findByText("3 - vendor3").should("exist");
      cy.findByText("Add a device...").should("exist"); //clear selection
    });
    it("adds a new device created from selector", () => {
      cy.findByText("Add a device...").parent().click();
      cy.findByText("Create...").click(); //select create device option
      cy.findByText("Create device").should("exist"); //open create device dialog
      cy.findByLabelText("UID").type("20"); //new device's uid
      cy.findByLabelText("Vendor").type("v"); //new device's vendor

      //click accept btn (the one in the upper dialog (latest in the DOM))
      cy.findAllByText("Accept").eq(1).click();

      cy.findByText("20 - v").should("exist"); //created device is the one selected
      cy.findByTestId("add_btn").click(); //click add

      cy.findByText("Devices [2]").should("exist"); // the gateway has 2 devices
      //added device now belongs to gateway's device list
      cy.findByTestId("scroll_view").findByText("20 - v").should("exist");
      cy.findByText("Add a device...").should("exist"); //clear selection
    });
    it("adds 10 devices top to the gateway, fails for the 11'th", () => {
      let i = 1;
      for (; i < 10; i++) {
        if (i === 3) continue;
        cy.findByText("Add a device...").parent().click();
        cy.findByText(i + " - vendor" + i).click(); //select device with uid = i
        cy.findByTestId("add_btn").click(); //add the device

        cy.findByTestId("scroll_view")
          .findByText(i + " - vendor" + i)
          .should("exist"); //added device now belongs to gateway's device list
        cy.findByText("Add a device...").should("exist"); //clear selection
      }
      cy.findByText("Add a device...").parent().click();
      cy.findByText(i + " - vendor" + i).click(); //select device with uid = i (i should be 10)
      cy.findByTestId("add_btn").click(); //add the device
      cy.findByText("Too many devices").should("exist"); // too many devices error toast
      // device wasn't added to gateway's device list
      cy.findByTestId("scroll_view")
        .findByText(i + " - vendor" + i)
        .should("not.exist");
    });
    it("removes 3 devices from gateway", () => {
      let i = 3;
      for (; i < 6; i++) {
        let dev_id = cy
          .findByTestId("scroll_view")
          .findByText(i + " - vendor" + i)
          .parent()
          .findByTestId("delete_btn")
          .click(); //click delete btn on device inside gateway's device list
        cy.findByTestId("scroll_view")
          .findByText(i + " - vendor" + i)
          .should("not.exist"); //deleted device should no longer be inside gateway's list
      }
      cy.findByText("Devices [7]").should("exist"); // the gateway has 7 devices
    });
    it("creates gateway", () => {
      cy.findByLabelText("Name").type(gatewayName);
      cy.findByText("Accept").should("not.be.disabled"); //field is valid (has no validation)

      cy.findByLabelText("Serial Number").type("s123");
      cy.findByText("Accept").should("not.be.disabled"); //field is valid (has no validation)

      cy.findByText("Accept").click(); //click accept

      cy.findByText("Successfully created!").should("exist"); //success notification
      cy.findByText("Create gateway").should("not.exist"); //dialog closed
      cy.findByText(gatewayName).should("exist"); //actual gateway card exists
      cy.findGatewayCardByText(gatewayName)
        .findByText("serial: s123")
        .should("exist"); //actual gateway card exists locally
      cy.reload();
      cy.findGatewayCardByText(gatewayName)
        .findByText("serial: s123")
        .should("exist"); //actual gateway card exists in backend
    });

    it("opens edit gateway dialog", () => {
      cy.findGatewayCardByText(gatewayName).findByTestId("edit_btn").click(); //click edit button in the test card

      cy.findByText("Edit gateway").should("exist"); //edit dialog opens
    });

    //"test existent gateway's devices edition"
    it("adds an existent device", () => {
      cy.findByText("Add a device...").parent().click();
      cy.findByText("4 - vendor4").click(); //select device with uid = 4
      cy.findByTestId("add_btn").click(); //add it to gateway's device list

      cy.findByText("Devices [8]").should("exist"); // the gateway has 8 devices
      //added device now belongs to gateway's device list
      cy.findByTestId("scroll_view").findByText("4 - vendor4").should("exist");
      cy.findByText("Add a device...").should("exist"); //clear selection after add
    });
    it("adds a new device created from selector", () => {
      cy.findByText("Add a device...").parent().click();
      cy.findByText("Create...").click(); //select Create option
      cy.findByText("Create device").should("exist"); //open create device dialog
      cy.findByLabelText("UID").type("21"); //new device uid
      cy.findByLabelText("Vendor").type("v"); //new device vendor
      cy.findAllByText("Accept").eq(1).click();
      cy.findByText("21 - v").should("exist"); //created device is the one selected
      cy.findByTestId("add_btn").click(); //click add

      cy.findByText("Devices [9]").should("exist"); // the gateway has 9 devices
      //added device now belongs to gateway's device list
      cy.findByTestId("scroll_view").findByText("21 - v").should("exist");
      cy.findByText("Add a device...").should("exist"); //clear selection
    });
    it("removes 3 devices from gateway", () => {
      let i = 6;
      for (; i < 9; i++) {
        let dev_id = cy
          .findByTestId("scroll_view")
          .findByText(i + " - vendor" + i)
          .parent()
          .findByTestId("delete_btn")
          .click(); //click delete on device inside gateway's device list
        cy.findByText("Successfully deleted").should("exist"); //notification, since the removal happens in the backend
        cy.findByTestId("scroll_view")
          .findByText(i + " - vendor" + i)
          .should("not.exist"); //deleted device should no longer be inside gateway's list
      }
      cy.findByText("Devices [6]").should("exist"); // the gateway has 6 devices
    });

    it("edits gateway's primitive fields", () => {
      cy.findByLabelText("IP").type("45");

      cy.findByText("Accept").click(); //click accept

      cy.findByText("Successfully edited!").should("exist"); //success notification
      cy.findByText("Create gateway").should("not.exist"); //dialog closed
      cy.findByText(gatewayName).should("exist"); //actual gateway card exists
      cy.findGatewayCardByText(gatewayName)
        .findByText("123.1.1.145")
        .should("exist"); //actual gateway card edited locally
      cy.reload();
      cy.findGatewayCardByText(gatewayName)
        .findByText("123.1.1.145")
        .should("exist"); //actual gateway card edited in backend
    });
    it("deletes  gateway", () => {
      cy.findGatewayCardByText(gatewayName).findByTestId("delete_btn").click(); //click delete button in the test card
      cy.findByText("Confirm").click(); //click confirm delete
      cy.findByText(gatewayName).should("not.exist"); //check delete locally
      cy.reload();
      cy.findByText(gatewayName).should("not.exist"); //check delete in backend
    });
  });
});
