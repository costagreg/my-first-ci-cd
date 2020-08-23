const express = require("express");

const app = express();
app.get("/", (req, resp) => {
  resp.send("Hello world v3!");
});

module.exports = app