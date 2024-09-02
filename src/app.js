import Koa2 from 'koa'
import KoaBody from 'koa-body'
import cors from 'koa2-cors'
import config from './config/index.js'
import path from 'path'
import route from './routes/index.js'
import routeCatch from './middleware/routeCatch.js'
import jwt from 'koa-jwt'
import fs from 'fs'
import {default as loggerMiddleware, logger} from './middleware/logger.js'

// import PluginLoader from './lib/PluginLoader'

const app = new Koa2()
const env = process.env.NODE_ENV // Current mode

const publicKey = fs.readFileSync(path.join(import.meta.dirname, '../publicKey.pub')).toString()

console.log(env);

app
  .use(cors({
    origin: () => env === 'development' ? '*' : config.system.HTTP_server_host,
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    allowMethods: ['PUT', 'POST', 'GET', 'DELETE'],
    credentials: false
  }))
  .use(routeCatch())
  .use(jwt({ secret: publicKey, cookie: 'token' }).unless({ path: [/^\/login|\/assets|\/voice/] }))
  .use(KoaBody({
    multipart: true,
    parsedMethods: ['POST', 'PUT', 'GET', 'DELETE'],
    formidable: {
      uploadDir: path.join('../assets/uploads/tmp')
    },
    jsonLimit: '2mb',
    formLimit: '2mb',
    textLimit: '2mb'
  })) // Processing request
  // .use(PluginLoader(SystemConfig.System_plugin_path))
  .use(route.routes())
  .use(route.allowedMethods())
  .use(loggerMiddleware)

app.listen(config.system.API_server_port)

logger.info('Now start API server on port ' + config.system.API_server_port + '...')

export default app
