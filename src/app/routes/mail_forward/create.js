const express = require("express");
const router = express.Router();
const app = require("../../index.js");
const axios = require("axios");

router.post("/create", async (req, res) => {
  const { selectedEmail, localString } = req.body;
  const kas_login = app.services.kas_login;
  const kas_auth_data = app.services.kas_auth;



  try {
    const create_forward_mail = {
      kas_login: kas_login,
      kas_auth_data: kas_auth_data,
      selected_email: selectedEmail,
      local_string: localString,
    }
    const nginxResponse = await axios.post(
      "http://nginx/php/create_mail_forward.php",
      create_forward_mail,
      { headers: { "Content-Type": "application/json" }, }
    );
  } catch (error) {
    console.error("Error in create forward mail", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
