const sh = require("shelljs");

sh.cd("./client");
sh.echo("installing client dependencies...");
sh.exec("npm install");

sh.cd("../api");
sh.echo("installing api dependencies...");
sh.exec("npm install");
