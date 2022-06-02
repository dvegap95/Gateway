const express = require("express");
const router = express.Router();
const PeripheralDevice = require("../models/PeripheralDevice");

//middleware for routes targeting a specific existent device
//expects :id parameter to exist in the request
//returns the corresponding device embedded in res object
async function getPeripheralDeviceMiddleware(req, res, next) {
  let device;
  try {
    device = await PeripheralDevice.findById(req.params.id); //find device in db
    if (!device) return res.status(404).json({ message: "Cannot find device" }); //retrun 404 if not found
  } catch (e) {
    //return 404 if :id doesn't fit mongoose requirements, since it means this _id never existed and never will
    if (e.name === "CastError") return res.status(404).json(e);
    return res.status(500).json(e); //something wrong
  }
  res.device = device; // embed device into response so it can be handled by next middlewares
  next();
}

//get an array containing all existent devices
router.get("/", async (req, res) => {
  res.status(200).json(await PeripheralDevice.find());
});

//get a specific device fetched by :id
router.get("/:id", getPeripheralDeviceMiddleware, (req, res) => {
  res.status(200).json(res.device);
});

//override (patch) specific fields of a device
router.patch("/:id", getPeripheralDeviceMiddleware, async (req, res) => {
  for (const key in req.body) {
    //iterate through all fields received in the request body
    if (Object.hasOwnProperty.call(req.body, key)) {
      res.device[key] = req.body[key];
    }
  }
  let error = res.device.validateSync(); //validate the resulting device before save it
  if (error) {
    return res.status(400).json({ ...error.errors }); // validation failed, bad request
  }
  try {
    const resultdevice = await res.device.save(); //save to database (update)
    return res.status(200).json(resultdevice); //success
  } catch (e) {
    return res.status(500).json(e); //something wrong
  }
});

//creates a device
router.post("/", async (req, res) => {
  let deviceData = {};
  let dta = req.body;

  for (const key in dta) {
    //iterate through all fields received in the request body
    if (Object.hasOwnProperty.call(dta, key)) {
      deviceData[key] = dta[key];
    }
  }

  let device = new PeripheralDevice({ ...deviceData }); //create model
  let error = device.validateSync(); //validate the resulting device before save it
  if (error) {
    return res
      .status(400)
      .json({ ...error.errors, message: "ValidationError" }); // validation failed, bad request
  }
  try {
    const resultdevice = await device.save(); //save to database (update)
    return res.status(201).json(resultdevice); //created successfully
  } catch (e) {
    return res.status(500).json(e); //error creating device
  }
});

//remove device with _id = :devid from device with _id = :id
router.delete("/:id", getPeripheralDeviceMiddleware, async (req, res) => {
  try {
    let resDev = await res.device.remove(); //remove target device from db
    return res.status(200).json(resDev); //return ok
  } catch (e) {
    return res.status(500).json(e); //something wrong
  }
});

module.exports = router;
