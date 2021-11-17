module.exports = {
    '租户A': require('./tenantA'),
    '租户B': require('./tenantB'),
    'http://localhost:8080': '租户A',
    'file://':'租户A'
}