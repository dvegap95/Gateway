const mongoose = require("mongoose");

// Each peripheral device has:
// •	a UID (number),
// •	vendor (string),
// •	date created,
// •	status - online/offline.

const peripheralDeviceSchema = new mongoose.Schema({
  uid: { type: Number, required: true },
  vendor: String,
  created: { type: Date, required: true, default: new Date() },
  status: {
    type: String,
    enum: ["online", "offline"],
    required: true,
    default: "offline",
  },
});

module.exports = mongoose.model('PeripheralDevice',peripheralDeviceSchema);
