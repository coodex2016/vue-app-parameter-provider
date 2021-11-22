const magicWord = "\u2009\u0819";

let __domainConfiguration =
    typeof process.browser === "undefined"
        ? require(`${process.cwd()}/${process.env.VUE_APP_PARAMETERS_MODULE}`)
        : require(`@/../${process.env.VUE_APP_PARAMETERS_MODULE}`);

/* eslint-disable no-undef */
if (typeof __rtEnvConfigurations !== 'undefined') {
    __domainConfiguration = Object.assign(__domainConfiguration, __rtEnvConfigurations)
}

module.exports = {
    __domainConfiguration,

    getDomain() {
        // 浏览器模式下: 生产环境使用location.origin, 开发、测试环境使用VUE_APP_DEVELOPMENT_KEY配置
        return process.browser
            ? process.env.NODE_ENV === "production"
                ? location.origin
                : process.env.VUE_APP_DEVELOPMENT_KEY || location.origin
            : this.__location;
    },

    getParameter(paramName, defaultValue) {
        let paramObj;
        if (process.env.VUE_APP_PARAMETERS_PROVIDER === "cloud") {
            paramObj = this.__domainConfiguration[this.getDomain()];

            const stack = [];
            while (typeof paramObj === "string") {
                // 对应配置为字符串时，代表此domain与字符串所指的配置一致
                if (stack.indexOf(paramObj) >= 0) {
                    stack.push(paramObj);
                    throw new Error("循环引用：" + stack.concat(" --> "));
                }
                stack.push(paramObj);
                paramObj = this.__domainConfiguration[paramObj];
            }
        } else {
            paramObj = this.__domainConfiguration;
        }

        const v = paramObj && paramObj[paramName];
        return typeof v === "undefined" ? defaultValue : v;
    },
    showParameters(invoker) {
        const getObj = () => {
            return typeof invoker === "function" ? invoker() : invoker;
        };
        const trace = (prevStr) => {
            const paramsObj = getObj();
            for (var key in paramsObj) {
                let f = paramsObj[key];
                if (key === "showParameters") continue;
                if (typeof f === "function") {
                    console.log(
                        prevStr + key + "(): " + f.apply(paramsObj) + ` [${typeof f.apply(paramsObj)}]`
                    );
                } else {
                    console.log(prevStr + key + ": " + f + ` [${typeof f}]`);
                }
            }
        };

        const traceAll = () => {
            for (var key in this.__domainConfiguration) {
                if (key === magicWord) continue;
                this.__location = key;
                console.log("parameters of [" + key + "]:");
                trace("    ");
                console.log("");
            }
            this.__location = magicWord;
            console.log("default parameters:");
            trace("    ");
        };

        if (process.browser) {
            trace("");
        } else if (process.env.NODE_ENV === "production") {
            process.env.VUE_APP_PARAMETERS_PROVIDER === "cloud" ? traceAll() : trace("");
        } else {
            this.__location = process.env.VUE_APP_DEVELOPMENT_KEY || magicWord;
            process.env.VUE_APP_PARAMETERS_PROVIDER === "cloud" && !process.env.VUE_APP_DEVELOPMENT_KEY
                ? traceAll() : trace("");
        }
    },
};
