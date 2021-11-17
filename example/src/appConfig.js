const parametersProvider = require('vue-app-parameter-provider')

module.exports = {
    /**
     * 变量名：title
     * @returns 获取应用标题
     */
    getAppTitle() {
        return parametersProvider.getParameter('title') || "APPILICATION TITLE";
    },
    /* 代码扩展区 */

    /* 代码扩展区 */
    showParameters() {
        console.log("\n====== all application parameters ======")
        parametersProvider.showParameters(this);
        console.log("========================================\n")
    }
}