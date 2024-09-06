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

const app = new Koa2()
const env = process.env.NODE_ENV // Current mode

app
  .use(cors({
    origin: () => env === 'development' ? '*' : config.system.xysbtn_origin,
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    allowMethods: ['POST', 'GET', 'DELETE'],
    credentials: false
  }))
  .use(loggerMiddleware())
  .use(routeCatch())
  .use(jwt({ secret: config.system.secert, cookie: 'token' }).unless({ path: [
    /^\/login|\/assets|\/voice/,
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

// app.listen(config.system.API_server_port)

const httpsServer = https.createServer({
  cert: fs.readFileSync(path.join(import.meta.dirname, '../certs', `${config.system.api_server_host}.pem`)),
  key: fs.readFileSync(path.join(import.meta.dirname, '../certs', `${config.system.api_server_host}.key`)),
}, app.callback())

httpsServer.listen(config.system.api_server_port)

logger.info('Now start API server on port ' + config.system.api_server_port + ', You are now in ' + env + ' mode')
