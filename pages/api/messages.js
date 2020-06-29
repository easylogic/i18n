const { google } = require('googleapis');
import googleAuth from '../googleapi/auth';
import {readMetadata, valuesBatchGet, packLang} from '../googleapi/utils';

const ftab = 'Locale';

export default function handler(req, res) {
    const metadata = readMetadata();
    const columns = ['key', ...metadata.languages];

    const ranges = columns.map((lang, index) => {
        const column = String.fromCharCode(65 + index);
        return `${ftab}!${column}${metadata.startIndex}:${column}`;
    });

    googleAuth(auth => {
        const sheets = google.sheets({ version: 'v4', auth });

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
}

