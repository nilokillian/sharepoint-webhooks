//const error = require("../middleware/error");
//const helmet = require("helmet");
const express = require("express");
const sharepointWebHooksAPI = require("../routes/sharepointWebHooksAPI");

module.exports = function(app) {
  //app.use(helmet());
  app.use(express.json());
  app.use("/api/sharepoint_webhooks", sharepointWebHooksAPI);
  //app.use(error);
};
