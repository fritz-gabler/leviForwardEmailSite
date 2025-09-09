const axios = require('axios');
const express = require("express")
const router = express.Router()

router.get("/get", async (req, res) => {
  try {
    // Forward the request to Nginx
    const nginxResponse = await axios.post('http://nginx/get_mail_accounts.php', req.body);
    res.json(nginxResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;


