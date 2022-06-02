const sh = require("shelljs");

sh.exec("npm run start", { async: true });
sh.cd("./client");
sh.exec(
  `npm run test -- --config baseUrl=http://localhost:${
    process.env.PORT || "3001"
  }`
);
