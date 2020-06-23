const fs = require('fs-extra');

const fname = 'metadata.json';

function readMetadata() {
    return fs.existsSync(fname) ? fs.readJsonSync(fname) : { sheetId: '', languages: [], startIndex: 2 };
}

export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(readMetadata(), null, 4));
}