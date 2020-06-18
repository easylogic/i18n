#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const child_process = require('child_process');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIAL_PATH = path.join(__dirname, 'credentials.json');

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    if (process.platform == 'darwin') child_process.spawn('open', [authUrl]);
    else console.info('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.info('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

module.exports = function (callback) {
    fs.readFile(CREDENTIAL_PATH, (err, content) => {
        if (err) return console.error('Error loading client secret file:', err);

        authorize(JSON.parse(content), (auth) => {
            callback(auth);
        });
    });
};
