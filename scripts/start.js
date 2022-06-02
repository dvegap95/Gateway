const sh = require("shelljs");
const fs = require("fs");

if (
  !fs.existsSync("./api/node_modules") ||
  !fs.existsSync("./client/node_modules")
)
  sh.exec("npm run install");

if (!fs.existsSync("./client/dist")) sh.exec("npm run build_client");

sh.cd("./api");
sh.exec("npm start");
