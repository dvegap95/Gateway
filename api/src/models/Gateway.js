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
        let bytes = ip.split(".");
        return (
          bytes.length === 4 &&
          bytes.reduce((valid, currByte) => {
            return valid &&
            !Number.isNaN(currByte) &&
            Number.isInteger(+currByte) &&
            +currByte >= 0 &&
            +currByte <= 255
          }, true)
        );
      },
      message: props => `${props.value} is not a valid ip address`
    },
  },
  devices: {type:[PeripheralDeviceSchema],validate:{
    validator:(d=>d.length<=10),
    message:"Too many devices"
  }}
});

module.exports = mongoose.model("GatewaySchema", gatewaySchema);
