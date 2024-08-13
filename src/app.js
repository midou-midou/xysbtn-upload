import Koa2 from 'koa'
import KoaBody from 'koa-body'
import cors from 'koa2-cors'
import {
  System as systemConfig
} from './config'
import path from 'path'
import MainRoutes from './routes/main-routes'
import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'
import ErrorRoutes from './routes/error-routes'
import jwt from 'koa-jwt'
import fs from 'fs'
import logger from './middleware/logger'
// import PluginLoader from './lib/PluginLoader'

const app = new Koa2()
const env = process.env.NODE_ENV // Current mode

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

app
  .use(cors({
    origin: () => env === 'development' ? '*' : systemConfig.HTTP_server_host,
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    allowMethods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
    credentials: false
  }))

  .use(jwt({ secret: publicKey }).unless({ path: [/^\/public|\/user|\/login|\/assets/] }))
  .use(ErrorRoutesCatch())
  .use(KoaBody({
    multipart: true,
    parsedMethods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
    formidable: {
      uploadDir: path.join(__dirname, '../assets/uploads/tmp')
    },
    jsonLimit: '2mb',
    formLimit: '2mb',
    textLimit: '2mb'
  })) // Processing request
  // .use(PluginLoader(SystemConfig.System_plugin_path))
  .use(MainRoutes.routes())
  .use(MainRoutes.allowedMethods())
  .use(ErrorRoutes())
  .use(logger)

app.on('error', (err) => {
  console.log(err);
})

app.listen(systemConfig.API_server_port)

console.log('Now start API server on port ' + systemConfig.API_server_port + '...')

export default app
