module.exports = function(io) {
  //console.log("io", io);
  const express = require("express");
  const router = express.Router();
  const logger = require("../startup/logging");
  const SPO = require("../csom_get_changes");

  router.get("/", (req, res) => {
    res.send("Works root!!");
  });

  router.post("/", (req, res) => {
    const msg = processRequest(req);
    console.log("msg : ", msg);
    res.send(msg);
  });

  function processRequest(req) {
    logger.info(
      `Incoming request for ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`
    );

    if (req.query.validationtoken !== undefined) {
      logger.info(
        `Subscription confirmed with Token : ${req.query.validationtoken}`
      );

      return req.query.validationtoken;
    } else {
      logger.info(
        `Notification received for id: ${req.body.value[0].subscriptionId}`
      );
      SPO._getChanges(
        io,
        req.body.value[0].siteUrl,
        req.body.value[0].resource
      );
      console.dir(req.body);
      return "Request processed";
    }
  }
  return (module.exports = router);
};
