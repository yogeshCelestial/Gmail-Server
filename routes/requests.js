const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const SCOPES = ['https://mail.google.com/', 'openid profile email'];

const credentials = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URL,
};

router.post('/', function (_, res) {
    const client = new google.auth.OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.redirect_uri)

    const authorizeUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    res.json({ url: authorizeUrl });
});

module.exports = router;