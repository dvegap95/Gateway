const server = require("./server");

const port = process.env.PORT || 3001; 

server.listen(port,()=>console.log(`server started at port ${port}`));
