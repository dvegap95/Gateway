const path = require('path');
require('dotenv').config({path:path.resolve(process.cwd(),"prod.env")});
const server = require("./server");

const port = process.env.PORT || 3001; 

server.listen(port,()=>console.log(`server started at port ${port}`));
