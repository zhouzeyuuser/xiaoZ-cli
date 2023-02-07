import { mkdirSync } from "fs"
import { jenkinsFile } from "../template/jenkins"
import { writeFileSafe } from "../utils"

export const addJenkins = ()=>{
    mkdirSync(`Jenkinsfile.groovy`, { recursive: true })

  writeFileSafe(`Jenkinsfile.groovy`, jenkinsFile)
}