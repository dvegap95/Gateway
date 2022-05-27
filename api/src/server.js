require('dotenv').config();
const { default: mongoose, connect } = require("mongoose");
const express = require('express');


mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error',()=>{});
db.on('open',()=>{});


const app = express();

app.use(express.json());

const gatewayRouter = require("./routes/gatewayRoutes");

app.use("/api/gateways",gatewayRouter);
module.exports = app;