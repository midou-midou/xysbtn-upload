import Koa2 from 'koa'
import KoaBody from 'koa-body'
import cors from 'koa2-cors'
import https from 'https'
import config from './config/index.js'
import path from 'path'
import route from './routes/index.js'
import routeCatch from './middleware/routeCatch.js'
import jwt from 'koa-jwt'
import fs from 'fs'
import {loggerMiddleware, logger} from './middleware/logger.js'

const app = new Koa2(config.koa2)
const env = process.env.NODE_ENV // Current mode

// 自动创建文件夹
fs.existsSync(config.system.voicePath) ? '' : fs.mkdirSync(config.system.voicePath)
fs.existsSync(config.system.uploadTmpPath) ? '' : fs.mkdirSync(config.system.uploadTmpPath)

app
  .use(cors({
    origin: () => env === 'development' ? '*' : config.system.xysbtn_origin,
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    allowMethods: ['POST', 'GET', 'DELETE'],
    credentials: false
  }))
  .use(loggerMiddleware())
  .use(routeCatch())
  .use(jwt({ secret: config.system.secret, cookie: 'token' }).unless({ path: [
    /^\/login|\/voice/,
    /^\/voice\/[a-zA-Z]+-[a-zA-Z0-9]+.mp3/i
  ]}))
  .use(KoaBody({
    multipart: true,
    parsedMethods: ['POST', 'GET', 'DELETE'],
    formidable: {
      uploadDir: config.system.uploadTmpPath
    }
  }))
  .use(route.routes())
  .use(route.allowedMethods())

if (env === 'development' || !config.system.ssl) {
  app.listen(config.system.api_server_port)
} else {
  if (!fs.existsSync(config.system.certPath)) {
    logger.error('证书目录不存在:'+config.system.certPath)
    throw new Error('证书目录不存在')
  }

  let certs = fs.readdirSync(config.system.certPath)
  const httpsServer = https.createServer({
    cert: fs.readFileSync(path.join(config.system.certPath, certs.find(v => v.endsWith('.pem')))),
    key: fs.readFileSync(path.join(config.system.certPath, certs.find(v => v.endsWith('.key')))),
  }, app.callback())
  
  httpsServer.listen(config.system.api_server_port)
}

logger.info('Now start API server on port ' + config.system.api_server_port + ', You are now in ' + env + ' mode')
