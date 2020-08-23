const express = require("express");

const app = express();
app.get("/", (req, resp) => {
  resp.send("Hello world v2!");
});

module.exports = app