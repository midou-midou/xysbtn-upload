import path, { join } from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import {readSecretFile} from '../tool/config.js'

const envPath = path.join(import.meta.dirname, '../../.env')
if (!fs.existsSync(envPath)) throw new Error('根目录下找不到.env文件')

dotenv.config({path: envPath})

const apiServerUrl = new URL(process.env.API_SERVER_URL)

export default {
  system: {
    api_server_type: apiServerUrl.protocol,
    api_server_host: apiServerUrl.hostname,
    api_server_port: apiServerUrl.port,
    voiceSizeLimit: 512 * 1024, // KB
    voicePath: path.join(process.env.XYSBTN_WORKPLACE, 'voices'),
    uploadTmpPath: path.join(process.env.XYSBTN_WORKPLACE, 'uploadTmp'),
    xysbtn_origin: 'https://voice.xuyanshe.club',
    secret: readSecretFile(path.join(process.env.XYSBTN_WORKPLACE, 'secret')),
    certPath: path.join(process.env.XYSBTN_WORKPLACE, 'certs'),
    allowCreateClfyCount: 5
  },
  db: {
    url: process.env.PG_URL
  }
}