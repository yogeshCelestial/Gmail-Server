const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const base64url = require('base64url');
const { google } = require('googleapis');
const fs = require('fs');

dotenv.config();
const { OAuth2Client } = require('google-auth-library');


router.post('/', async function (req, resp) {
    const { to, subject, text } = req.body;
    try {
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL,
        );

        // reading tokens stored in token.json 
        const fileContent = fs.readFileSync('token.json', 'utf-8');
        const tokens = JSON.parse(fileContent);

        await oAuth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        // Create the MIME message
        const rawMessage = [
            `To: ${to}`,
            `From: MedGuide`,
            `Subject: ${subject}`,
            '',
            `${text}`,
        ].join('\r\n');

        // Encode the message
        const encodedMessage = base64url.encode(rawMessage);

        const createMessage = {
            raw: encodedMessage,
        };

        // Send the message
        const response = await gmail.users.messages.send({
            userId: 'me',
            resource: createMessage,
        });
        resp.json({ response: response.data });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;