const fs = require('fs-extra');

export const batchUpdates = function(sheets, sheetId, requests) {
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

export const valuesBatchUpdate = function(sheets, sheetId, resource) {
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

export const valuesBatchGet = function(sheets, sheetId, ranges) {
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

export const readMetadata = function() {
    const fname = './pages/googleapi/metadata.json';
    return fs.existsSync(fname) ? fs.readJsonSync(fname) : { sheetId: '', languages: [], startIndex: 2 };
}

export const packLang = function(keys, values) {
    return keys.reduce((prev, key, i) => {
        let value = !values ? [''] : values[i];
        if (!value || value.length == 0) value = [''];
        prev[key[0]] = value[0];
        return prev;
    }, {});
}