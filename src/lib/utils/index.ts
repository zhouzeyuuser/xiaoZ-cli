import { existsSync, readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import yaml from 'js-yaml'
import { exec as _exec } from "child_process"
import chalk from 'chalk'

export const ROOT = process.cwd()
//获取路径
export const getPath = name => resolve(ROOT, name)
//预检测路径
export const isExist = (name: string) => existsSync(name.includes(ROOT) ? name : getPath(name))

export const isExistTs = () => isExist('tsconfig.json')
//检测yarn文件
export const isYarn = isExist(`yarn.lock`)
export const pack = isExist(`yarn.lock`) ? `yarn add ` : `npm install `
//读取yml文件 cicd配置
export const loadYml = name => yaml.load(readFileSync(getPath(name), 'utf8'))
// 写入文件还是创建文件
export const writeFile = (name: string, obj) => {
  writeFileSync(getPath(name), typeof obj === 'string' ? obj : yaml.dump(obj))
} // createWriteStream(getPath(name)).write(typeof obj === 'string' ? obj : yaml.dump(obj))
export const writeFileSafe = (name: string, obj) => {
  if (!isExist(getPath(name))) {
    writeFile(name, obj)
  }
}
//颜色插件
export const logFnBase = async (fn, prefix, suffix) => {
  try {
    if (prefix) {
      console.log(chalk.white(prefix))
    }
    await fn();
    if (suffix) {
      console.log(chalk.green(suffix))
      chalk.green(suffix)
    }
  } catch (err) {
    console.error(err)
  }

}
export const logFn = async (fn, name) => {
  await logFnBase(fn, `${name}任务开始`, `${name}任务已结束`)
}
//递归遍历
export const extendConfig = (config, tmpl) => {
  Object.keys(tmpl).map(key => {
    const item = tmpl[key]
    const isArray = Array.isArray(item)
    if (!isArray) {
      if (typeof item === 'object') {
        if (config[key] === undefined) config[key] = {}
        extendConfig(config[key], item)
      } else {
        config[key] = config[key] ?? item
      }
    } else if (isArray) {
      config[key] = config[key] ?? item
    }
  })
}
//插件cmd安装执行提示语句
export const exec = (str) => {
  console.log(chalk.gray(`\n执行命令： ${str}，请耐心等待...`))
  return new Promise((resolve) => {
    _exec(str, {
      cwd: process.cwd(),
    }, (err, stdout) => {
      if (err) {
        console.error(err)
      } else {
        console.log(chalk.green(`命令 ${str} 执行完成`))
      }
      resolve(stdout)
    })
  })
}
//初始化插件
export const installDeps = () => {
  setTimeout(() => {
    dependencies?.length && exec(`${pack} ${dependencies.join(` `)}`)
    devDependencies?.length && exec(`${pack} ${devDependencies.join(` `)} -D`)
  }, 100)
}
//合并
export const pushSafe = (list = [], item) => {
  if (!list.includes(item)) {
    list.push(item)
  }
}
//获取插件记录json有无
export const getPackageJson = () => isExist(getPath(`package.json`)) ? require(getPath(`package.json`)) : {};
// 写入插件json
export const writePackageJson = (obj) => {
  const json = getPackageJson()
  extendConfig(json, obj)

  writeFile(`package.json`, JSON.stringify(json, null, '  '))
}
//所有的插件包里面的插件
export const deps = {
  ...(getPackageJson().devDependencies || {}),
  ...(getPackageJson().dependencies || {})
}

export const dependencies = []
export const devDependencies = []
// 写入不同的配置json对象
export const pushDeps = (type = 'dev', ...list) => {
  const _list = type === 'dev' ? devDependencies : dependencies

  list.map(v => {
    if (!deps[v]) {
      _list.push(v)
      // deps.push(v)
    }
  })
}
