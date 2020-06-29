import { google } from 'googleapis';
import fs from 'fs-extra';
import googleAuth from '../googleapi/auth';
import {readMetadata, batchUpdates, valuesBatchUpdate} from '../googleapi/utils';

const fname = './pages/googleapi/metadata.json';
const ftab = 'Locale';

export default function handler(req, res) {
    if (req.method == 'POST') {
        const metadata = {
            sheetId: req.body.sheetId,
            languages: req.body.languages,
            startIndex: 1,
        };

        googleAuth(auth => {
            const sheets = google.sheets({ version: 'v4', auth });

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
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(readMetadata(), null, 4));
    }
}