# vue-app-parameter-provider

基于 vue 的一个前端多租参数管理组件

## 安装

```sh
yarn add @coodex/vue-app-parameter-provider
```

or

```sh
npm install --save @coodex/vue-app-parameter-provider
```

## 在项目中使用

### 在`vue.config.js`中增加以下代码

```javascript
// 自定义mode时，NODE_ENV默认为development，因此根据vue-cli-service的参数调整自定义mode是的环境信息
if (process.argv && process.argv[2] === "build") {
  process.env.NODE_ENV = "production";
  process.env.BABEL_ENV = "production";
}
```

### 增加参数配置模块

推荐方式

```txt
conf                -- 自行定义
    params.js       -- 所有租户的变量模块
    tenantA.js      -- 可选，A租户模块，命名自行设计
src
    appConfig.js    -- 聚合所有变量获取的单元，面向开发者提供明确的、有业务含义的变量数据
.env.cloud          -- 多租环境变量，用来通知vue-app-parameter-provider使用什么模式、哪个变量模块
.env.cloud.local    -- 用来指明多租环境下开发调试时使用哪个租户的变量
.env.[xxxx]         -- 单独部署时，通知vue-app-parameter-provider使用指定租户变量
```

`appConfig.js`参考代码

```javascript
const parametersProvider = require("@coodex/vue-app-parameter-provider");

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
```

租户变量模块推荐实践方案

各租户变量独立配置，`params.js`负责聚合租户变量及别名，可以让单独部署和云租模式用户体验完全一致

各租户变量配置模块

```javascript
/**
 * 使用commonjs导出[变量：值]
 */
module.exports = {
  title: "租户A的云产品",
};
```

`params.js`

```javascript
module.exports = {
  租户A: require("./tenantA"),
  租户B: require("./tenantB"),
  "http://localhost:8080": "租户A", // 云租模式下，根据location.origin来对应到具体租户变量
  "file://": "租户A",
};
```

`.env.cloud`

```txt
# 使用云租模式
VUE_APP_PARAMETERS_PROVIDER=cloud

# 云租模式下使用的变量配置模块，相对于工程根路径
VUE_APP_PARAMETERS_MODULE=conf/params
```

`.env.cloud.local`

多租模式的变量配置应该根据生产环境的域名来对应，开发调试的时候怎么办？在聚合配置中增加开发调试域名到租户的映射可以做到，但是该配置是版本受控的，并且协作开发时，A 需要调试租户 A 的产品；B 需要调试租户 B 的产品，如果在版本受控代码中修改，势必引起冲突，再者，放入到聚合配置中，会将代码中服务于调试的配置也打包到生产环境中，这不是我们希望的情况。

所以，可以通过不受版本控制的`.env.cloud.local`文件来指明当前开发者使用哪个租户进行调试

```txt
# 可选
VUE_APP_DEVELOPMENT_KEY=租户A
```

`.env.[xxxx]`

当某租户的系统需要独立部署时，我们只需要新建一个环境文件指定对应的租户配置模块即可

```txt
VUE_APP_PARAMETERS_MODULE=conf/tenantB
```

### 调试、构建脚本

#### 云模式

`package.json`中，如下修改

- `"serve": "vue-cli-service serve",` --> `"serve": "vue-cli-service serve --mode cloud",`
- `"build": "vue-cli-service build",` --> `"build": "vue-cli-service build --mode cloud --dest dist/cloud/prod",`

#### 增加一个独立部署配置

当系统明确需要一套新的独立部署时

- 确定部署名，例如：`xxxx`
- 新增`.env.xxxx`文件
- `package.json`的`scripts`中
  - 增加`"serve:xxxx": "vue-cli-service serve --mode xxxx",`
  - 增加`"build:xxxx": "vue-cli-service build --mode xxxx --dest dist/xxxx",`
- 开发调试使用`yarn serve:xxxx`或`npm run serve:xxxx`
- 打包静态资源使用`yarn build:xxxx`或`npm run build:xxxx`

### 云模式下，多环境发布

构建静态资源时，我们可能会需要在多环境中测试，而这些环境的租户域名设置与生产环境不一定相同，可是如果把非生产环境的内容配置到变量聚合文件中，打包出来的文件也会包含着非生产环境的配置信息，不推荐使用这种方式。

`@coodex/vue-app-parameter-provider` 自 `0.0.9`起，增加了一个命令行参数，用于指定编译后的运行环境，并自动加载该环境的租户访问域名配置。

**约定**: `所有租户的变量模块`中只放置生产环境的配置，`环境配置模块`只放置对应环境的租户访问域名与租户配置的映射，`环境配置模块`的命名规则为`所有租户的变量模块`+`大写环境名`，例如`conf/params`是`所有租户的变量模块`，则`SIT环境配置模块`为`conf/paramsSIT`

例如，我们生产环境，A 租户是 a.myapp.com,B 租户是 b.myapp.com；SIT 环境中 A 租户是 a.myapp-sit.com,B 租户是 b.myapp-sit.com，则：

`所有租户的变量模块`配置为

```javascript
module.exports = {
  租户A: require("./tenantA"),
  租户B: require("./tenantB"),
  "https://a.myapp.com": "租户A",
  "https://b.myapp.com": "租户B",
};
```

`SIT环境配置`为

```javascript
module.exports = {
  "https://a.myapp-sit.com": "租户A",
  "https://b.myapp-sit.com": "租户B",
};
```

`@coodex/vue-app-parameter-provider/rtEnv`负责导出需要在`webpack.DefinePlugin`中定义的对象。使用示例如下：

```js
// vue.config.js
module.exports = {
  // ...其他配置
  configureWebpack: {
    // ...其他配置
    plugins: [
      new webpack.DefinePlugin(
        require("@coodex/vue-app-parameter-provider/rtEnv")
      ),
    ],
  },
};
```

`package.json`中，脚本增加`"buildSIT": "vue-cli-service build --mode cloud --dest dist/cloud/sit --rtenv sit",`，与云模式 build 脚本的不同：1)dest 分环境设置；2)增加 rtenv 参数

### 其他

为了在编译器看清楚当前构建的参数配置情况，可以在`vue.config.js`中，增加`require("./src/appConfig").showParameters()`在终端控制台输出当前环境的配置情况
