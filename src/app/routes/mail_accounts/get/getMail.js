const axios = require("axios");
const express = require("express");
const router = express.Router();
const app = require("../../../index.js");

router.get("/get", async (req, res) => {
  const kas_login = app.services.kas_login;
  const kas_auth_data = app.services.kas_auth;

  if (kas_auth_data || kas_login)
    try {
      const get_mail_account_body = {
        kas_login: kas_login,
        kas_auth_data: kas_auth_data,
      };

      console.log("Test before");
      const nginxResponse = await axios.post(
        "http://nginx/php/get_mail_accounts.php",
        get_mail_account_body,
        { headers: { "Content-Type": "application/json" }, }
      );

      console.log("Test after");

      console.log("nginx response");
      console.log(nginxResponse.data);
      res.send("Hello from file");
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;
