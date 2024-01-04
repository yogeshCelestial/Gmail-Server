const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');


router.get('/', (_, resp) => {
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL,
    );

    // Load or obtain the credentials token.json
    const TOKEN_PATH = 'token.json';
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));

    // Create a Gmail API instance
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    // Fetch threads
    gmail.users.threads.list({
        userId: 'me', // 'me' represents the authenticated user
        maxResults: 10, // Specify the maximum number of threads to retrieve
    }, (err, res) => {
        if (err) {
            console.error('Error fetching threads:', err);
            return;
        }

        const threads = res.data.threads;
        if (threads) {
            resp.json({ data: threads });
        } else {
            console.log('No threads found.');
        }
    });

});

module.exports = router;



