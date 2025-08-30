const express = require('express');

const app = express();

app.get("/", (req, res) => {
  console.log("hi");
  res.send("hi");
})

const forwardCreate = require('./routes/mail_forward/create')

app.use('/mail-forward', forwardCreate);

app.listen(3000);
