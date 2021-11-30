const express = require("express");
const Router = require("./notes.js");
const app = express();

app.use("/notes", Router);

module.exports = app;