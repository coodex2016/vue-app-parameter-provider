const parametersProvider = require('@coodex/vue-app-parameter-provider')
const params = () => {
    return {
        /**
         * 变量名：title
         * @returns 获取应用标题
         */
        getTitle() {
            return parametersProvider.getParameter("title", "APPILICATION TITLE");
        },
        // 或者
        /**
         * 应用标题，变量名: title
         */
        title: parametersProvider.getParameter("title", "APPILICATION TITLE"),

        /* 在此处增加其他变量即可 */
    };
};

module.exports = {
    ...params(),

    showParameters() {
        console.log("\n====== all application parameters ======");
        parametersProvider.showParameters(params);
        console.log("========================================\n");
    },
};