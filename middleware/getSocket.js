module.exports = function(app) {
  const http = require("http").Server(app);
  const io = require("socket.io")(http);

  return (module.exports = io);
};
