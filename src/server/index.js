const { google } = require('googleapis');

const express = require('express');
const bodyParser = require('body-parser');

const webpack = require('webpack');
const fs = require('fs-extra');

const server = express();
const staticMiddleWare = express.static('dist');
const config = require('../../webpack.config.js');
const compiler = webpack(config);

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, config.devServer);

// 핫 로딩 미들웨어를 추가하자!
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
});

// 메타데이터 파일명
const fname = 'metadata.json';
const ftab = 'Locale';

server.use(webpackDevMiddleware);
// 웹팩dev 미들웨어 다음, static 미들웨어 이전
server.use(webpackHotMiddleware);
server.use(staticMiddleWare);

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.listen(8080, () => {
    console.log('Server is Listening : ', `http://localhost:8080`);
});

function batchUpdates(sheets, sheetId, requests) {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.batchUpdate(
            {
                spreadsheetId: sheetId,
                resource: {
                    requests: requests,
                },
            },
            (err, res) => {
                if (err != null) reject(err);
                else resolve(res);
            },
        );
    });
}

function valuesBatchUpdate(sheets, sheetId, resource) {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.batchUpdate(
            {
                spreadsheetId: sheetId,
                resource: resource,
            },
            (err, res) => {
                if (err != null) reject(err);
                else resolve(res);
            },
        );
    });
}

function valuesBatchGet(sheets, sheetId, ranges) {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.batchGet(
            {
                spreadsheetId: sheetId, // 시트 아이디
                ranges: ranges,
            },
            (err, res) => {
                if (err != null) reject(err);
                else resolve(res);
            },
        );
    });
}

function readMetadata() {
    return fs.existsSync(fname) ? fs.readJsonSync(fname) : { sheetId: '', languages: [], startIndex: 2 };
}

function packLang(keys, values) {
    return keys.reduce((prev, key, i) => {
        let value = !values ? [''] : values[i];
        if (!value || value.length == 0) value = [''];
        prev[key[0]] = value[0];
        return prev;
    }, {});
}

require('./googleapi/auth')((auth) => {
    const sheets = google.sheets({ version: 'v4', auth });

    server.post('/metadata', (req, res) => {
        const metadata = {
            sheetId: req.body.sheetId,
            languages: req.body.languages,
            startIndex: 1,
        };

        batchUpdates(sheets, metadata.sheetId, [
            {
                updateSheetProperties: {
                    properties: {
                        title: 'Locale',
                        sheetId: 0,
                    },
                    fields: 'title',
                },
            },
            {
                addSheet: {
                    properties: {
                        title: 'Users',
                    },
                },
            },
            {
                addProtectedRange: {
                    protectedRange: {
                        range: {
                            sheetId: 0,
                            startRowIndex: 0,
                            endRowIndex: 1,
                            startColumnIndex: 0,
                            endColumnIndex: metadata.languages.length + 1,
                        },
                        description: 'Protecting columns',
                        warningOnly: true,
                    },
                },
            },
        ]).then((values) => {
            valuesBatchUpdate(sheets, metadata.sheetId, {
                valueInputOption: 'RAW',
                data: [
                    {
                        range: `${ftab}!A1`,
                        values: [['key']],
                    },
                ].concat(
                    metadata.languages.map((lang, index) => {
                        return {
                            range: `${ftab}!${String.fromCharCode(66 + index)}1`,
                            values: [[lang]],
                        };
                    }),
                ),
            }).then(() => {
                fs.writeJSON(fname, metadata);
            });
        });

        res.send(null);
    });

    server.get('/metadata', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(readMetadata(), null, 4));
    });

    server.get('/messages', (req, res) => {
        const metadata = readMetadata();
        const columns = ['key', ...metadata.languages];

        const ranges = columns.map((lang, index) => {
            const column = String.fromCharCode(65 + index);
            return `${ftab}!${column}${metadata.startIndex}:${column}`;
        });

        valuesBatchGet(sheets, metadata.sheetId, ranges).then((output) => {
            const lang = req.query.language;
            const keys = output.data.valueRanges[0].values;
            const json = {};
            metadata.languages.forEach((lang, index) => {
                json[lang] = packLang(keys, output.data.valueRanges[index + 1].values);
            });

            res.setHeader('Content-Type', 'application/json');
            if (json[lang]) res.end(JSON.stringify(json[lang], null, 4));
            else res.end(JSON.stringify(json, null, 4));
        });
    });
});
