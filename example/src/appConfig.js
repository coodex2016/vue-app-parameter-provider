const parametersProvider = require('vue-app-parameter-provider')

module.exports = {
    /**
     * 变量名：title
     * @returns 获取应用标题
     */
    getAppTitle() {
        return parametersProvider.getParameter('title') || "APPILICATION TITLE";
    },
    // 或者
    /**
     * 应用标题
     */
    title: parametersProvider.getParameter('title') || "APPILICATION TITLE",
    /* 上述两种模式任选一种即可，应须增加doc描述 */

    /* 代码扩展区 */
    /* 在此处增加
    /* 代码扩展区 */
    showParameters() {
        console.log("\n====== all application parameters ======")
        parametersProvider.showParameters(this);
        console.log("========================================\n")
    }
}