const express = require("express");
const router = express.Router();
const app = require("../../index.js");


router.post("/set", (req, res) => {
  const kas_login = req.body.kas_login;
  const kas_auth = req.body.kas_auth;

  app.services = {
    kas_login: kas_login,
    kas_auth: kas_auth
  };
  return res.send("send");
});

module.exports = router;
