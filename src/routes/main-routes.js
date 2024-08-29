import KoaRouter from 'koa-router'
import controllers from '../controllers'

const router = new KoaRouter()

export default router
  .all('/upload', controllers.upload)
  .post('/login', controllers.auth.login)
  .post('/logout', controllers.auth.logout)
