import Koa2 from 'koa'
import KoaBody from 'koa-body'
import cors from 'koa2-cors'
import config from './config/index.js'
import path from 'path'
import MainRoutes from './routes/mainRoutes.js'
import errorRoutesCatch from './middleware/errorRoutesCatch.js'
import errorRoutes from './routes/errorRoutes.js'
import jwt from 'koa-jwt'
import fs from 'fs'
import {default as loggerMiddleware, logger} from './middleware/logger.js'

// import PluginLoader from './lib/PluginLoader'

const app = new Koa2()
const env = process.env.NODE_ENV // Current mode

const publicKey = fs.readFileSync(path.join(import.meta.dirname, '../publicKey.pub'))

app
  .use(cors({
    origin: () => env === 'development' ? '*' : config.system.HTTP_server_host,
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    allowMethods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
    credentials: false
  }))
  // 判断错误路由
  .use(errorRoutesCatch())
  .use(jwt({ secret: publicKey, cookie: 'token' }).unless({ path: [/^\/login|\/assets/] }))
  .use(KoaBody({
    multipart: true,
    parsedMethods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
    formidable: {
      uploadDir: path.join('../assets/uploads/tmp')
    },
    jsonLimit: '2mb',
    formLimit: '2mb',
    textLimit: '2mb'
  })) // Processing request
  // .use(PluginLoader(SystemConfig.System_plugin_path))
  .use(MainRoutes.routes())
  .use(MainRoutes.allowedMethods())
  .use(errorRoutes())
  .use(loggerMiddleware)





app.listen(config.system.API_server_port)

logger.info('Now start API server on port ' + config.system.API_server_port + '...')

export default app
