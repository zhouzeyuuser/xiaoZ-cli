import { mkdirSync } from "fs"
import { vscodeTmpl } from "../template/vscode"
import { writeFileSafe } from "../utils"

export const addVscode = () => {
  mkdirSync(`.vscode/settings`, { recursive: true })

  writeFileSafe(`.vscode/settings.json`, vscodeTmpl)

}
