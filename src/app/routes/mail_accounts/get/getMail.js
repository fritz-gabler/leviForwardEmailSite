const axios = require('axios');
const express = require("express");
const router = express.Router();
const app = require("../../../index.js");

router.get("/get", async (req, res) => {
  try {
    // Forward the request to Nginx
    console.log("That is the body of get mail accounts");
    console.log(req.body);
    const nginxResponse = await axios.post('http://nginx/get_mail_accounts.php', req.body);
    res.json(nginxResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;


