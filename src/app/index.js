const path = require('path')
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'frontend')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'))
})

const forwardCreate = require('./routes/mail_forward/create')
const getMailAccounts = require('./routes/mail_accounts/get/getMail')

app.use('/mail-forward', forwardCreate);
app.use('/mail-accounts', getMailAccounts);

app.listen(3000);
