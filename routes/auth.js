const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const fs = require('fs');
const { google } = require('googleapis');

dotenv.config();
const { OAuth2Client } = require('google-auth-library');

router.get('/', async function (req, resp) {
    const code = req.query.code;
    try {
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        const res = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(res.tokens);

        try {
            // save tokens in json file
            const jsonString = JSON.stringify(res.tokens, null, 2);
            const filePath = 'token.json';
            fs.writeFileSync(filePath, jsonString);
            console.log('Write Success');
        } catch (err) {
            console.error('Error writing to file:', err);
        }
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const response = await gmail.users.getProfile({
            userId: 'me',
        })
        const userProfile = response.data;
        console.log(userProfile);
        resp.json({ response: userProfile });
    } catch (err) {
        // console.log(err);
    }
});

module.exports = router;