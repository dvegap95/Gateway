const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const Gateway = require("../models/Gateway");
const PeripheralDevice = require("../models/PeripheralDevice");

//middleware for routes targeting a specific existent gateway
//expects :id parameter to exist in the request
//returns the corresponding gateway embedded in res object
async function getGatewayMiddleware(req, res, next) {
  let gateway;
  try {
    gateway = await Gateway.findById(req.params.id); //find gateway in db
    if (!gateway)
      return res.status(404).json({ message: "Cannot find gateway" }); //retrun 404 if not found
  } catch (e) {
    //return 404 if :id doesn't fit mongoose requirements, since it means this _id never existed and never will
    if (e.name === "CastError") return res.status(404).json(e);
    return res.status(500).json(e); //something wrong
  }
  res.gateway = gateway; // embed gateway into response so it can be handled by next middlewares
  next();
}

//get an array containing all existent gateways
router.get("/", async (req, res) => {
  res.status(200).json(await Gateway.find());
});

//get a specific gateway fetched by :id
router.get("/:id", getGatewayMiddleware, (req, res) => {
  res.status(200).json(res.gateway);
});

//override (patch) specific fields of a gateway
router.patch("/:id", getGatewayMiddleware, async (req, res) => {
  for (const key in req.body) {
    //iterate through all fields received in the request body
    if (Object.hasOwnProperty.call(req.body, key)) {
      res.gateway[key] = req.body[key];
    }
  }
  let error = res.gateway.validateSync(); //validate the resulting gateway before save it
  if (error) {
    return res.status(400).json({ ...error.errors }); // validation failed, bad request
  }
  try {
    const resultgateway = await res.gateway.save(); //save to database (update)
    return res.status(200).json(resultgateway); //success
  } catch (e) {
    return res.status(500).json(e); //something wrong
  }
});

//creates a gateway
router.post("/", async (req, res) => {
  let gatewayData = {};
  let dta = req.body;

  for (const key in dta) {
    //iterate through all fields received in the request body
    if (Object.hasOwnProperty.call(dta, key)) {
      gatewayData[key] = dta[key];
    }
  }

  let gateway = new Gateway({ ...gatewayData }); //create model
  let error = gateway.validateSync(); //validate the resulting gateway before save it
  if (error) {
    return res
      .status(400)
      .json({ ...error.errors, message: "ValidationError" }); // validation failed, bad request
  }
  try {
    const resultgateway = await gateway.save(); //save to database (update)
    return res.status(201).json(resultgateway); //created successfully
  } catch (e) {
    return res.status(500).json(e); //error creating gateway
  }
});

//remove device with _id = :devid from gateway with _id = :id
router.delete("/:id/device/:devid", getGatewayMiddleware, async (req, res) => {
  let deviceIndex = res.gateway.devices.findIndex(
    //find array index containing the target device
    (el) => el._id == req.params.devid
  );
  let device = {};
  if (deviceIndex >= 0) {
    //found any?
    device = res.gateway.devices.splice(deviceIndex, 1); //remove it from devices array
  } else {
    return res.status("404").json({ message: "Device not found" });
  }
  try {
    await res.gateway.save(); //save changes to db
    return res.status(200).json(device); //return 200 OK and the deleted device object
  } catch (e) {
    return res.status(500).json(e); //something wrong
  }
});

//add a device to a gateway, if '_id' is provided in the body
//device is assumed to exist, created otherwise
router.post("/:id/device", getGatewayMiddleware, async (req, res) => {
  let device =
    //if _id provided assume it exists in the db
    (req.body._id && (await PeripheralDevice.findById(req.body._id))) ||
    //create the device
    new PeripheralDevice(req.body);

  res.gateway.devices.push(device); //ad the device to target gateway
  let error = res.gateway.validateSync(); //validate target gateway
  if (error) {
    return res.status(400).json({ ...error.errors }); // validation went wrong
  }
  console.log(res.gateway);
  try {
    await res.gateway.save(); //save target gateway
    //return 200 for previously existent device or 201 for newly created device
    return res.status(req.body._id ? 200 : 201).json(device);
  } catch (e) {
    return res.status(500).json(e);
  }
});
//delete gateway with _id = :id
router.delete("/:id", getGatewayMiddleware, async (req, res) => {
  try {
    let resGw = await res.gateway.remove(); //remove target gateway from db
    return res.status(200).json(resGw); //return ok
  } catch (e) {
    return res.status(500).json(e); //something wrong
  }
});

module.exports = router;
