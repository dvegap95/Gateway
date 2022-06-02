const sh = require("shelljs");

sh.cd("./api");
sh.exec("npm test");