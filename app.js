const express = require("express");
const app = express();

app.use(express.json());

app.get("/_api", (req, res) => {
  res.send("Works");
});

app.get("/", (req, res) => {
  res.send("Works root!");
});

app.post("/webHook", (req, res) => {
  const msg = processRequest(req);

  res.send(msg);
});

function processRequest(req) {
  console.log(
    `Incoming request for ${req.protocol}://${req.get("host")} ${
      req.orogonalUrl
    }`
  );

  if (req.query.validationToken !== null) {
    console.log(
      `Subscription confirmed with Token : ${req.query.validationToken}`
    );
    return req.query.validationToken;
  }
}
const port = 3009;
app.listen(port, () => console.log(`port ${port} is being listened`));
