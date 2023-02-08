import { writeFileSafe, exec, isExist, writeFile } from "../utils";
import chalk from "chalk";
import { readFileSync } from "fs";
import {
  sentryAppContext,
  sentryAppTitle,
  sentryWebpackContext,
  sentryWebpackDevtool,
  sentryWebpackTitle,
  sentryclirc,
} from "../template/sentry";
export const addSentry = () => {
  if (isExist(`.sentryclirc`)) {
    console.log(
      chalk.bgGreen(`有关 sentry配置文件 已存在，如有必要请需自行修改`)
    );
  } else {
    exec(`yarn add @sentry/react @sentry/tracing @sentry/rrweb`);
    exec(`yarn add @sentry/webpack-plugin -D`);
    exec(`yarn add clean-webpack-plugin -D`);
    writeFileSafe(`.sentryclirc`, sentryclirc);
  }
  //查找到app.ts的入口文件之后将文件插入
  if (isExist(`app.ts`)) {
    //读取出文件中所有的内容并且按照换行符切割,修改之后再拼接回去
    const allData = readFileSync(`src/app.ts`, "utf-8").split(/\r\n|\n|\r/gm);
    for (let index = 0; index < allData.length; index++) {
      const element = allData[index];
      if (!element.includes("import")) {
        allData[index] = sentryAppTitle + sentryAppContext + element;
        break;
      }
    }
    writeFile(`src/app.ts`, allData.join(`\r\n`));
  } else {
    writeFileSafe(`src/app.ts`, sentryAppTitle + sentryAppContext);
  }
  //查找到umi的配置文件进行处理 可以为.umirc或者umi中引出的defineConfig配置
  if (isExist(`.umirc.ts`)) {
    const allLen = [true, false, true];
    //读取出文件中所有的内容并且按照换行符切割,修改之后再拼接回去
    const allData = readFileSync(`.umirc.ts`, "utf-8").split(/\r\n|\n|\r/gm);
    console.log("allData", allData);
    for (let index = 0; index < allData.length; index++) {
      const element = allData[index];
      if (!element.includes("import") && allLen[0]) {
        allData[index] = sentryWebpackTitle + element;
        allLen[0] = false;
      }
      //FIXME 暂时取消对devtool的单独判断逻辑改为chainwebpack中做
      // if (element.includes("devtool") && allLen[1]) {
      //   allData[index] = sentryWebpackDevtool;
      //   allLen[1] = false;
      // }
      if (element.includes("chainWebpack")) {
        console.log(
          chalk.bgGreen(
            `请将以下配置加入chainWebpack中\n${sentryWebpackContext}`
          )
        );
      }
      //FIXME 怎么找到chainWebpack里准确的位置？？？？目前选择直接在defineConfig之后插入
      if (!element.includes("chainWebpack") && allLen[2]) {
        //TODO寻找到chainWebpack合适的位置进行数据插入
        allData[
          allData.indexOf(
            allData.filter((el) =>
              el.includes("export default defineConfig({"))[0]
          ) 
        ] = `export default defineConfig({\n${sentryWebpackContext}`;
        allLen[2] = false;
      }
      if (!allLen.includes(true)) {
        break;
      }
    }
    writeFile(`.umirc.ts`, allData.join(`\r\n`));
  } else {
    console.log(
      chalk.bgGreen(
        `目前配置仅支持umi框架，其他框架请自行配置webpack打包上传sourcemap配置`
      )
    );
  }
};
