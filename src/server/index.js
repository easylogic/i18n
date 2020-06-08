const { google } = require('googleapis');

const express = require('express');
const bodyParser = require('body-parser')

const webpack = require('webpack')
const fs = require('fs-extra');

const server = express()
const staticMiddleWare = express.static("dist");
const config = require("../../webpack.config.js")
const compiler = webpack(config);

const webpackDevMiddleware = require("webpack-dev-middleware")(
    compiler,
    config.devServer
)

// 핫 로딩 미들웨어를 추가하자!
const webpackHotMiddleware = 
    require("webpack-hot-middleware")(compiler, {
        path: '/__webpack_hmr',
    })

server.use(webpackDevMiddleware);
 // 웹팩dev 미들웨어 다음, static 미들웨어 이전
server.use(webpackHotMiddleware);
server.use(staticMiddleWare);

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json());

server.listen(8080, () => {
    console.log("Server is Listening : ", `http://localhost:8080`);
});

function batchUpdates(sheets, sheetId, requests) {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            resource: {
                requests: requests
            },
        }, (err, res) => {
            if (err != null) reject(err);
            else resolve(res);
        });
    });
}

function valuesBatchUpdate(sheets, sheetId, resource) {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: sheetId,
            resource: resource,
        }, (err, res) => {
            if (err != null) reject(err);
            else resolve(res);
        });
    });
}

require('./googleapi/auth')(auth => {
    const sheets = google.sheets({ version: 'v4', auth });
    const fname = "metadata.json";
    
    server.post("/metadata", (req, res) => {
        const metadata = {
            sheetId: req.body.sheetId,
            languages: req.body.languages
        };

        batchUpdates(sheets, metadata.sheetId, [
            {
                'updateSheetProperties': {
                    "properties": {
                        "title": "Locale",
                        "sheetId": 0
                    },
                    "fields": "title"
                } 
            },
            {
                'addSheet': {
                    'properties':{
                        'title': 'Users'
                    }
                } 
            },
            {
                "addProtectedRange": {
                    "protectedRange": {
                        "range": {
                            "sheetId": 0,
                            "startRowIndex": 0,
                            "endRowIndex": 1,
                            "startColumnIndex": 0,
                            "endColumnIndex": metadata.languages.length + 1,
                        },
                        "description": "Protecting columns",
                        "warningOnly": true
                    }
                }   
            }
        ]).then(values => {
            valuesBatchUpdate(sheets, metadata.sheetId, {
                valueInputOption: "RAW",
                data: [{
                    range: "Locale!A1",
                    values: [[ 'key' ]]
                }].concat(metadata.languages.map((lang, index) => {
                    return {
                        range: `Locale!${String.fromCharCode(66 + index)}1`,
                        values: [[ lang ]]
                    }
                }))
            }).then(() => {
                fs.writeJSON(fname, metadata);
            });
        });

        res.send(null);
    });
    
    server.get("/metadata", (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(
                fs.existsSync(fname) ? fs.readJsonSync(fname) : { sheetId: "", languages: [] },
                null,
                4
            )
        );
    });
});