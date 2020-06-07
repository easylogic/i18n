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

server.get("/metadata", (req, res) => {
    const fname = "metadata.json";

    res.setHeader('Content-Type', 'application/json');
    res.end(
        JSON.stringify(
            fs.existsSync(fname) ? fs.readJsonSync(fname) : { sheetId: "", languages: [] },
            null,
            4
        )
    );
});

server.post("/metadata", (req, res) => {
    fs.writeJSON("metadata.json", {
        sheetId: req.body.sheetId,
        languages: req.body.languages
    });

    res.send(null);
});

server.listen(8080, () => {
    console.log("Server is Listening : ", `http://localhost:8080`)
});