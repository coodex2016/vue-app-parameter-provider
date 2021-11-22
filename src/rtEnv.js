let __rtEnvConfigurations = false;

if (process.env.NODE_ENV === 'production') {
    let runtimeEnv = "";

    if (process.env.VUE_APP_PARAMETERS_PROVIDER === "cloud") {
        if (process.argv) {
            for (var i = 0; i < process.argv.length; i++) {
                if (process.argv[i] === "--rtenv") {
                    if (process.argv.length > i) {
                        runtimeEnv = process.argv[i + 1];
                    }
                    break;
                }
            }
        }
        if (runtimeEnv) {
            __rtEnvConfigurations = require(`${process.cwd()}/${process.env.VUE_APP_PARAMETERS_MODULE}${runtimeEnv.toUpperCase()}`)
        }
    }
}

module.exports = { __rtEnvConfigurations: JSON.stringify(__rtEnvConfigurations) } || {}