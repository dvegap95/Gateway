const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const Gateway = require("../models/Gateway");

router.get("/", async (req, res) => {
  res.status(200).json(await Gateway.find());
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
    console.log(gateway,req.params && req.params.id);
    if (!gateway)
      return res.status(404).json({ message: "Cannot find gateway" });
  } catch (e) {
    if(e.name === "CastError")return res.status(404).json(e);
    return res.status(500).json(e);
  }
  res.gateway = gateway;
  next();
}

module.exports = router;
