//const error = require("../middleware/error");
//const helmet = require("helmet");

module.exports = function(app) {
  //app.use(helmet());
  const io = require("../middleware/getSocket")(app);
  const express = require("express");
  const sharepointWebHooksAPI = require("../routes/sharepointWebHooksAPI")(io);

  app.use(express.json());
  app.use("/api/sharepoint-webhooks", sharepointWebHooksAPI);
};
