import { getPackageJson, writeFile } from "../utils"
/**
 * 删除掉package.json的通配符字段；
 */
const reg = new RegExp("\\^", "g")
export const addClock = () => {
  const json = JSON.parse(JSON.stringify(getPackageJson()).replace(reg, ''))
  writeFile(`package.json`, JSON.stringify(json, null, '  '))
}
