// 自定义mode时，NODE_ENV默认为development，因此根据vue-cli-service的参数调整自定义mode是的环境信息
if (process.argv && process.argv[2] === 'build') {
    process.env.NODE_ENV = 'production';
    process.env.BABEL_ENV = 'production';
}

require("./src/appConfig").showParameters()

module.exports = {
    publicPath: './',
    productionSourceMap: false,
    configureWebpack: {
        devtool: "source-map",
        externals: {
            T: 'T',
            'AMap': 'AMap',
            './cptable': 'var cptable'
        },
    },
}