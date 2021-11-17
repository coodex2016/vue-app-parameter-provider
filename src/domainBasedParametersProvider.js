/* eslint-disable no-empty */
try { require(`@/../${process.env.VUE_APP_PARAMETERS_MODULE}`); } catch (e) { }
try { require(`${process.env.PWD}/${process.env.VUE_APP_PARAMETERS_MODULE}`); } catch (e) { }

module.exports = {
    __domainConfiguration: process.browser ?
        require(`@/../${process.env.VUE_APP_PARAMETERS_MODULE}`) :
        require(`${process.env.PWD}/${process.env.VUE_APP_PARAMETERS_MODULE}`),

    getDomain() {
        // 浏览器模式下: 生产环境使用location.origin, 开发、测试环境使用VUE_APP_DEVELOPMENT_KEY配置
        return process.browser ?
            (process.env.NODE_ENV === 'production' ? location.origin : (process.env.VUE_APP_DEVELOPMENT_KEY || location.origin)) :
            this.__location;
    },

    getParameter(paramName) {
        let paramObj;
        if (process.env.VUE_APP_PARAMETERS_PROVIDER === 'cloud') {
            paramObj = this.__domainConfiguration[this.getDomain()];

            const stack = [];
            while (typeof paramObj === 'string') {// 对应配置为字符串时，代表此domain与字符串所指的配置一致
                if (stack.indexOf(paramObj) >= 0) {
                    stack.push(paramObj);
                    throw new Error("循环引用：" + stack.concat(' --> '))
                }
                stack.push(paramObj);
                paramObj = this.__domainConfiguration[paramObj];
            }
        } else {
            paramObj = this.__domainConfiguration;
        }
        return paramObj && paramObj[paramName];
    },
    showParameters(invoker) {
        const trace = prevStr => {
            for (var key in invoker) {
                let f = invoker[key];
                if (typeof f === 'function' && key !== 'showParameters') {
                    console.log(prevStr + key + ": " + f.apply(invoker));
                }
            }
        }

        const traceAll = () => {
            for (var key in this.__domainConfiguration) {
                if (key === 'default') continue;
                this.__location = key;
                console.log('parameters of [' + key + ']:');
                trace('\t')
                console.log('\n')
            }
            this.__location = '_________'
            console.log('default paramters:');
            trace('\t')
            console.log('\n')
        };

        if (process.browser) {
            trace('')
        } else if (process.env.NODE_ENV === 'production') {
            process.env.VUE_APP_PARAMETERS_PROVIDER === 'cloud' ? traceAll() : trace('');
        } else {
            this.__location = process.env.VUE_APP_DEVELOPMENT_KEY || '_________'
            trace('')
        }
    }
}