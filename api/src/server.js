require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const gatewayRouter = require("./routes/gatewayRoutes");
const path = require("path")
const resolve = path.resolve

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error',()=>{process.exit(1)});
db.on('open',()=>{});


const app = express();

app.use(express.static(process.env.STATIC_CONTENT_PATH));

app.use(express.json());


app.use("/api/gateways",gatewayRouter);


app.use((req, res, next) => {
    res.sendFile(path.join(resolve(process.env.STATIC_CONTENT_PATH), "index.html"));
});

module.exports = app;