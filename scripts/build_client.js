const sh = require("shelljs");
const fs = require("fs");

sh.cd("./client");
if (!fs.existsSync("./node_modules")) {
    sh.exec("npm install");
}
sh.echo("building client...");
sh.exec("npm run build");
