const express = require("express");
const router = express.Router();
const logger = require("../startup/logging");

router.get("/", (req, res) => {
  res.send("Works root!!");
});

router.post("/", (req, res) => {
  const msg = processRequest(req);

  res.send(msg);
});

function processRequest(req) {
  logger.info(
    `Incoming request for ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }`
  );
  console.log("req.query.validationToken", req.query.validationToken);
  if (req.query.validationToken !== undefined) {
    logger.info(
      `Subscription confirmed with Token : ${req.query.validationToken}`
    );

    return req.query.validationToken;
  }
}

module.exports = router;
