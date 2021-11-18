module.exports = {
    '租户A': require('./tenantA'),
    '租户B': require('./tenantB'),
    'http://localhost:8080': '租户A',// 云租模式下，根据location.origin来对应到具体租户变量
    'file://':'租户A'
}