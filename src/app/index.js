const path = require('path')
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
})

const forwardCreate = require('./routes/mail_forward/create')
const getMailAccounts = require('./routes/mail_accounts/get/getMail')
const set_login_data = require('./routes/login_data/set_login_data')

app.use('/mail-forward', forwardCreate);
app.use('/mail-accounts', getMailAccounts);
app.use('/login-data', set_login_data);

app.listen(3000);
module.exports = {app};
