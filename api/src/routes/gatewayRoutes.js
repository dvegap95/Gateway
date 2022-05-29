const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const Gateway = require("../models/Gateway");
const PeripheralDevice = require("../models/PeripheralDevice");

router.get("/", async (req, res) => {
  res.status(200).json(await Gateway.find());
});

router.get("/:id/device/:devid", getGatewayMiddleware, (req, res) => {
  let device = res.gateway.devices.find((el) => el._id == req.params.devid);
  return device
    ? res.status(200).json(device)
    : res.status(404).json({ message: `Device ${res.gateway.devices.map(el=>el._id)} not found` });
});

router.get("/:id", getGatewayMiddleware, (req, res) => {
  res.status(200).json(res.gateway);
});

router.patch("/:id", getGatewayMiddleware, async (req, res) => {
  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      res.gateway[key] = req.body[key];
    }
  }
  let error = res.gateway.validateSync();
  if (error) {
    return res.status(400).json({ ...error.errors });
  }
  try {
    const resultgateway = await res.gateway.save();
    return res.status(200).json(resultgateway);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.post("/", async (req, res) => {
  let gatewayData = {};
  let dta = req.body;

  for (const key in dta) {
    if (Object.hasOwnProperty.call(dta, key)) {
      gatewayData[key] = dta[key];
    }
  }

  let gateway = new Gateway({ ...gatewayData });
  let error = gateway.validateSync();
  if (error) {
    return res.status(400).json({ ...error.errors });
  }
  try {
    const resultgateway = await gateway.save();
    return res.status(201).json(resultgateway);
  } catch (e) {
    return res.status(500).json(e);
  }
});


router.delete("/:id/device/:devid", getGatewayMiddleware,async (req, res) => {
  let deviceIndex = res.gateway.devices.findIndex((el) => el._id == req.params.devid);
  let device = {}
  if(deviceIndex >= 0){
    device = res.gateway.devices.splice(deviceIndex,1);
  }
  else{
    return res.status("404").json({message:"Device not found"});
  }
  try {
    await res.gateway.save();
    return res.status(200).json(device);
  } catch (e) {
    return res.status(500).json(e);
  }
});


router.post("/:id/device", getGatewayMiddleware,async (req, res) => {
  let device = req.body._id && await PeripheralDevice.findById(req.body._id) || new PeripheralDevice(req.body);
  console.log({device});
  res.gateway.devices.push(device);
  let error = res.gateway.validateSync();
  if (error) {
    return res.status(400).json({ ...error.errors });
  }
  console.log(res.gateway);
  try {
    await res.gateway.save();
    return res.status(req.body._id ? 200 : 201).json(device);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.delete("/:id", getGatewayMiddleware, async (req, res) => {
  try {
    let resGw = await res.gateway.remove();
    return res.status(200).json(resGw);
  } catch (e) {
    return res.status(500).json(e);
  }
});

async function getGatewayMiddleware(req, res, next) {
  let gateway;
  try {
    gateway = await Gateway.findById(req.params.id);
    if (!gateway)
      return res.status(404).json({ message: "Cannot find gateway" });
  } catch (e) {
    if (e.name === "CastError") return res.status(404).json(e);
    return res.status(500).json(e);
  }
  res.gateway = gateway;
  next();
}

module.exports = router;
