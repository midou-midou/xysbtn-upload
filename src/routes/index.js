import KoaRouter from 'koa-router'
import controllers from '../controllers/index.js'

const router = new KoaRouter()

export default router
  .post('/login', controllers.auth.login)
  .post('/logout', controllers.auth.logout)
  .get('/voice', controllers.voice.listVoice)
  .get('/voice/:voicePath', controllers.voice.playVoice)
  .post('/upload', controllers.voice.uploadVoices)
