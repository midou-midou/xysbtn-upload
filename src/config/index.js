import path from 'path'
import fs from 'fs'

export default {
  system: {
    api_server_type: 'https://',
    api_server_host: 'upload.xuyanshe.club',
    api_server_port: '3000',
    voiceSizeLimit: 512 * 1024, // KB
    voicePath: path.join(import.meta.dirname, '../../voices'),
    uploadTmpPath: path.join(import.meta.dirname, '../../uploadTmp'),
    xysbtn_origin: 'https://voice.xuyanshe.club',
    secert: fs.readFileSync(path.join(import.meta.dirname, '../../', 'secret.pub')).toString()
  },
  db: {
    url: 'postgres://xysbtn:m6MOjZzM@localhost:5432/xysbtn_db'
  }
}