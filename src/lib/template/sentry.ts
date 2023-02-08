//sentry的令牌文件
export const sentryclirc = `[defaults]
url=xxxx
org=xxx
project=xxxxx

[auth]
token=xxxxxx

[http]
verify_ssl=false`;
//sentry的app入口文件的引入插件配置
export const sentryAppTitle = `
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import SentryRRWeb from '@sentry/rrweb';
`;
//sentry的app入口具体内容配置
export const sentryAppContext = `
Sentry.init({
    dsn: 'https://xxxxx',
    integrations: [
      new Integrations.BrowserTracing(),
      new SentryRRWeb({
        checkoutEveryNms: 10 * 1000, // 每10秒重新制作快照
        checkoutEveryNth: 200, // 每 200 个 event 重新制作快照
        maskAllInputs: false, // 将所有输入内容记录为 *
      }),
    ],
    environment: process.env.NODE_ENV,
    autoSessionTracking: false,
    release: 'x.x.x',//版本号需要跟配置一致
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  Sentry.setUser({
    id:'xxx', // user名字 
    email: 'xxx', // 邮箱
    username: 'xxx', // 用户名
  });
`;
//sentry的webpack配置的引入插件包
export const sentryWebpackTitle = `
const SentryPlugin = require('@sentry/webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
`;
//sentry的webapck配置是否开启源码sourcemap配置
export const sentryWebpackDevtool = `
devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
`;
//sentry的webpack配置的具体chainWebpack配置
export const sentryWebpackContext = `
devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
chainWebpack(config, { webpack }) {
  if (process.env.NODE_ENV === 'production') {//当为prod时候才进行sourcemap的上传，如果不判断，在项目运行的打包也会上传
    config.plugin("sentry").use(SentryPlugin, [{
      ignore: ['node_modules'],
      include: 'xxx/xxx/xx', //上传dist文件的js
      configFile: './.sentryclirc', //配置文件地址
      release: 'x.x.x', //版本号，自己定义的变量，整个版本号在项目里面一定要对应
      deleteAfterCompile: true,
      urlPrefix: '~/xxx' // js的代码路径前缀如publicPath
    }]);
    //上传之后删除sourcemap
    config.plugin('cleanMap').use(CleanWebpackPlugin, [{
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ["*.js.map"]//针对outpath为相对路径
    }])
  }
},
`;
