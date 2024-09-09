import fs from 'fs'
import path from 'path'

export const readSecretFile = filePath => {
  try {
    let secretPath = fs.readdirSync(filePath)
    return fs.readFileSync(path.join(filePath, secretPath[0])).toString('utf-8')
  } catch (error) {
    throw new Error('读取jwt校验密钥文件出错'+error)
  }
}