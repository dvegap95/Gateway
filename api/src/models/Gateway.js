const mongoose = require("mongoose");
const PeripheralDeviceSchema = require("./PeripheralDevice").schema;

// Each gateway has:
// •	a unique serial number (string),
// •	human-readable name (string),
// •	IPv4 address (to be validated),
// •	multiple associated peripheral devices.

const gatewaySchema = new mongoose.Schema({
  serialNumber: String,
  name: String,
  ipAddress: {
    type: String,
    validate: {
      validator: (ip) => {
        //ip address validator (algorithm)
        let bytes = ip.split("."); //separates ip sections (bytes)
        return (
          bytes.length === 4 && //4 ip sections found
          bytes.reduce((valid, currByte) => {
            //validate each section
            return (
              valid && //is previous section valid?
              !Number.isNaN(currByte) && //is current section a valid number?
              Number.isInteger(+currByte) && //is current section an integer?
              +currByte >= 0 &&
              +currByte <= 255 // is current section value betwen 0 and 255?
            );
          }, true)
        );
      },
      message: (props) => `${props.value} is not a valid ip address`, //message on validation failure
    },
  },
  devices: {
    type: [PeripheralDeviceSchema],
    validate: {
      validator: (d) => d.length <= 10, // field validation: no more than 10 devices allowed per gateway
      message: "Too many devices",
    },
  },
});

module.exports = mongoose.model("GatewaySchema", gatewaySchema);
