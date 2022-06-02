const sh = require("shelljs");

sh.exec("npm run start", {async:true});
sh.cd("./client");
sh.exec("npm run dev");
