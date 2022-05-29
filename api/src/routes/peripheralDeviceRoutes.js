const express = require("express");
const router = express.Router();
const PeripheralDevice = require("../models/PeripheralDevice");

router.get("/", async (req, res) => {
  res.status(200).json(await PeripheralDevice.find());
});

router.get("/:id", getPeripheralDeviceMiddleware, (req, res) => {
  res.status(200).json(res.device);
});

router.patch("/:id", getPeripheralDeviceMiddleware, async (req, res) => {
  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      res.device[key] = req.body[key];
    }
  }
  let error = res.device.validateSync();
  if (error) {
    return res.status(400).json({ ...error.errors });
  }
  try {
    const resultdevice = await res.device.save();
    return res.status(200).json(resultdevice);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.post("/", async (req, res) => {
  let deviceData = {};
  let dta = req.body;

  for (const key in dta) {
    if (Object.hasOwnProperty.call(dta, key)) {
      deviceData[key] = dta[key];
    }
  }

  let device = new PeripheralDevice({ ...deviceData });
  let error = device.validateSync();
  if (error) {
    return res.status(400).json({ ...error.errors });
  }
  try {
    const resultdevice = await device.save();
    return res.status(201).json(resultdevice);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.delete("/:id", getPeripheralDeviceMiddleware, async (req, res) => {
  try {
    let resGw = await res.device.remove();
    return res.status(200).json(resGw);
  } catch (e) {
    return res.status(500).json(e);
  }
});

async function getPeripheralDeviceMiddleware(req, res, next) {
  let device;
  try {
    device = await PeripheralDevice.findById(req.params.id);
    console.log(device,req.params && req.params.id);
    if (!device)
      return res.status(404).json({ message: "Cannot find device" });
  } catch (e) {
    if(e.name === "CastError")return res.status(404).json(e);
    return res.status(500).json(e);
  }
  res.device = device;
  next();
}

module.exports = router;
