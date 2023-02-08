import { mkdirSync } from "fs"
import { jenkinsFile } from "../template/jenkins"
import { writeFileSafe } from "../utils"

export const addJenkins = ()=>{

  writeFileSafe(`Jenkinsfile.groovy`, jenkinsFile)
}