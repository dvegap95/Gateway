const path = require('path');
require('dotenv').config({path:path.resolve(process.cwd(),"prod.env")});
const server = require("./server");

const port = process.env.PORT || 3001; 
const host = process.env.HOST || 'localhost'; 

server.listen(port,host,()=>console.log(`server started at port ${port}`));
