# xiaoz-cli
工程化插件包


提供一套完整的前端项目 脚手架 支持，通过选择对应配置直接集成，免去安装依赖再配置的麻烦。
## 安装
```cmd
npm i -g xiaoz-cli
```

## 使用
### 1. 选择工具，可用 -D 参数声明，或在命令行中进行多选
```js
xiaoZ cli // 如不提供参数，默认会进行多选

// 或者
xiaoZ cli -D jest eslint ts editorConfig commit vscode release travis clock sentry jenkins
// -D 参数支持数组，如提供了-D 参数，则不会进行选择

```
### 2. 添加全部工具
```js
xiaoZ cli -a
```

### 3. 显示支持的工具列表
```js
xiaoZ cli -l
```

## 工具介绍
### 1. eslint 代码校验

安装 eslint 相关依赖，并添加 eslint 配置文件，若本地不存在，则直接覆盖；若已存在，则会进行字段合并

文档地址： [https://eslint.org/docs/user-guide/configuring/](https://eslint.org/docs/user-guide/configuring/)

### 2.vscode配置项目化

生成.vscode中的settings.json配置，插入基础配置内容，后续可叠加代码片段等项目归属配置

文档地址：[https://code.visualstudio.com/docs/getstarted/settings](https://code.visualstudio.com/docs/getstarted/settings)

### 3. editorConfig 编辑器格式化
（仅为推荐配置，自动格式化需自行配置）

生成 .editorconfig 文件。与 eslint 配合时，还会将本模板的 ***eslint rules 合并至 eslint配置文件***。

### 4. ts

安装 typescript 依赖，生成tsconfig.json。

### 5. commit 规范代码提交格式
安装 ``` `commitizen`, `@commitlint/config-conventional`, `@commitlint/cli`, `husky`, `lint-staged` ``` 等依赖，并在package.json 添加 ``` "cz": "cz" ``` 的脚本，提交代码时可通过 ```npm run cz``` 代替 ```git commit``` 。

添加了 pre-commit 进行 ```eslint --fix```， commit-msg 进行 ``` commitlint ```

commitlint 文档地址：[https://github.com/conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint)

husky 文档地址：[https://typicode.github.io/husky/#/?id=automatic-recommended](https://typicode.github.io/husky/#/?id=automatic-recommended)

lint-staged文档地址：[https://github.com/okonet/lint-staged#example-ignore-files-from-match](https://github.com/okonet/lint-staged#example-ignore-files-from-match)

### 6. release 规范自动化发布

安装 standard-version 依赖。
并添加以下对象至 package.json（如已存在，并不会覆盖）
```js
{
  scripts: {
    "release": "standard-version", // 本地发布，修改版本号，根据commit 生成 changelog.md，不提交代码
    "release:rc": "standard-version --prerelease rc", // 预发布
    "pup": "npm run release && git push --follow-tags origin master", // 本地发布并提交到远程
    "pub": "npm run pup && npm publish" // 本地发布并提交到远程，然后发布到npm
  }
}
```
文档地址：[https://github.com/conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version)
### 7. jest 单元测试

安装 ```jest``` 等相关依赖，并生成 ```jest.config.js```相关配置文件。

文档地址：[https://jestjs.io/zh-Hans/docs/getting-started](https://jestjs.io/zh-Hans/docs/getting-started)
### 8. travis 自动化CI/CD

生成 ```.travis.yml``` 文件，相关配置如不满足需要，可自行修改。

文档地址：[https://docs.travis-ci.com/user/tutorial/](https://docs.travis-ci.com/user/tutorial/)

### 9. package.json版本号锁定

对package.json版本通配符进行处理，锁定项目插件版本号。
### 10. sentry监控配置（react/umi）

生成```.sentryclirc``` 配置文件，在打包配置中增加sourceMap上传，在入口文件增加配置Sentry.init

文档地址：[https://docs.sentry.io/](https://docs.sentry.io/)

### 11. jenkinsFile文件配置生成

生成```Jenkinsfile.groovy``` 配置文件，集成拉取代码，打包，发包

文档地址：[https://www.jenkins.io/](https://www.jenkins.io/)
