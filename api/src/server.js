const mongoose = require("mongoose");
const express = require('express');
const gatewayRouter = require("./routes/gatewayRoutes");
const peripheralDeviceRouter = require("./routes/peripheralDeviceRoutes");
const path = require("path")
const resolve = path.resolve
const nocache = require("nocache");

//connect to environment-defined database 
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

//handle db error
db.on('error',(e)=>{
    console.error(e);
    process.exit(1)
});

const app = express();

//serve static content from environment-defined path
//should be client/dist path (client distribution folder)
app.use(express.static(process.env.STATIC_CONTENT_PATH||"../client/dist"));

app.use(express.json());//json body objects
app.use("/api",nocache());//disable cache for api

//add routers
app.use("/api/gateways",gatewayRouter);
app.use("/api/peripheral-devices",peripheralDeviceRouter);

//api fallback distinct from global fallback
app.use("/api",(req, res, next) => {
    res.status(404).json({message:"Api not found"})
});
//global fallback (static content) to index.html to serve SPA
app.use((req, res, next) => {
    res.sendFile(path.join(resolve(process.env.STATIC_CONTENT_PATH), "index.html"));
});

module.exports = app;