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
    voicePath: path.join(import.meta.dirname,'../..', 'voices'),
    uploadTmpPath: path.join(import.meta.dirname,'../..', 'uploadTmp'),
    xysbtn_origin: 'https://voice.xuyanshe.club',
    secret: readSecretFile(path.join(import.meta.dirname,'../..', 'secret')),
    allowCreateClfyCount: 5,
    ssl: false,
    certPath: path.join(import.meta.dirname,'../..', 'certs')
  },
  db: {
    url: process.env.PG_URL
  },
  // koa2配置-参考官方配置
  koa2: {
    proxy: true,
    // 因为nginx配置反向代理，且只有一级反向代理，所以要按照下面配置才能获得原始IP
    maxIpsCount: 1
  }
}