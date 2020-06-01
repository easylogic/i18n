#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const rimraf = require('rimraf');
const child_process = require('child_process');
const readline = require('readline');
const { google } = require('googleapis');

const LANGUAGES = [ 'ko', 'en', 'ja' ];
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SHEET_ID = '15oMs1zgyQo5BBHiU_LYwLXLt64BMeIYCY2dSJPaA-n0';
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIAL_PATH = path.join(__dirname, 'credentials.json');
const OUTPUT_MESSAGE_JS_PATH = path.join(__dirname, '../../../output');

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    if (process.platform == 'darwin')
        child_process.spawn('open', [authUrl]);
    else
        console.info('Authorize this app by visiting this url:', authUrl);

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
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function packLang(keys, values, subs=[]) {
    return keys.reduce((prev, key, i) => {
        let value = values[i];
        if (value == null || value.length == 0)
            value = subs[i];
        prev[key[0]] = value[0];
        return prev;
    }, {});
}

function syncMessages(auth) {
    const sheets = google.sheets({ version: 'v4', auth });

    sheets.spreadsheets.values.batchGet({
        spreadsheetId: SHEET_ID, // 시트 아이디
        ranges: ['Locale!A2:A', 'Locale!B2:B', 'Locale!C2:C', 'Locale!D2:D'], // 시트 이름 (키, 한국어, 영어, 일본어)
    }, (err, res) => {
        if (err) {
            if(err == 'TypeError: Cannot read property \'replace\' of undefined') {
                return console.error('\'i18n message\' 공유 문서에 필수 값이 입력되지 않았습니다.');
            } else {
                return console.error('The API returned an error: ' + err);
            }
        }
        
        // TODO: 가져온 데이터를 처리하는 부분
        console.log(res.data.valueRanges[0].values);
        console.log(res.data.valueRanges[1].values);
    });
}

function main() {
    // i18n 메시지 초기화
    rimraf(OUTPUT_MESSAGE_JS_PATH, function() {
        fs.ensureDirSync(OUTPUT_MESSAGE_JS_PATH);
    });
    
    // i18n 메시지 동기화
    fs.readFile(CREDENTIAL_PATH, (err, content) => {
        if (err) return console.error('Error loading client secret file:', err);
        authorize(JSON.parse(content), syncMessages);
    });
}

main();
