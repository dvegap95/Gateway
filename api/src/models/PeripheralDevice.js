const mongoose = require("mongoose");

// Each peripheral device has:
// •	a UID (number),
// •	vendor (string),
// •	date created,
// •	status - online/offline.

const peripheralDeviceSchema = new mongoose.Schema({
  uid: { type: Number },
  vendor: String,
  //created (date created) field setted to current date as default, 
  //which will always be the date of creation
  created: { type: Date, required: true, default: new Date() },
  status: {
    type: String,
    enum: ["online", "offline"],//only 2 values possible
    required: true,
    default: "offline",
  },
});

module.exports = mongoose.model('PeripheralDevice',peripheralDeviceSchema);
