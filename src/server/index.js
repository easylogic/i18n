const express = require('express');

const server = express()
const webpack = require('webpack')

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

server.listen(8080, () => {
    console.log("Server is Listening : ", `http://localhost:8080`)
});