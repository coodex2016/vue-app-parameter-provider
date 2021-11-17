
// 自定义mode时，NODE_ENV默认为development
if (process.argv[2] == 'build') {
    process.env.NODE_ENV = 'production';
    process.env.BABEL_ENV = 'production';
}

require("./src/appConfig").showParameters()

module.exports = {
    publicPath: './',
    productionSourceMap: false,
    configureWebpack: {
        devtool: "source-map",
    },
}