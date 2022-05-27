require('dotenv').config();
const { default: mongoose, connect } = require("mongoose");
const express = require('express');


mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error',console.log);
db.on('open',()=>console.log("Connected to database"));


const app = express();
const port = process.env.PORT || 3001; 

app.use(express.json());

const gatewayRouter = require("./routes/gatewayRoutes");

app.use("/api/gateways",gatewayRouter);

app.listen(port,()=>console.log(`server started at port ${port}`));