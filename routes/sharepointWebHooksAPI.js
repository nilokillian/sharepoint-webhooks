module.exports = function(io) {
  //console.log("io", io);
  const express = require("express");
  const router = express.Router();
  const logger = require("../startup/logging");
  const CSOM = require("../CSOM");

  router.get("/", async (req, res) => {
    await CSOM.getChanges(
      io,
      "/sites/dev-sc-classic",
      "C67D1E9C-AC18-4BCA-A2E4-190180F6161B"
    );

    res.send("Works root!!");
  });

  router.post("/", async (req, res) => {
    const msg = await processRequest(req);
    console.log("msg : ", msg);
    res.send(msg);
  });

  async function processRequest(req) {
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

      await CSOM.getChanges(
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
