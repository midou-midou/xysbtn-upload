import jwt from 'jsonwebtoken'
import authService from '../services/auth.js'
import config from '../config/index.js'
import { clientError } from '../tool/response.js'

// 检查jwt是否合法
export const checkAuth = async ctx => {
  // const token = ctx.request.header.authorization
  const token = ctx.cookies.get('token')
  let service = new authService()
  try {
    const decoded = jwt.verify(token, config.system.secret)
    // name先从pg查，后面改到redis
    if (decoded.name && decoded.name === await service.getUploader(decoded.name)) {
      return {
        status: 1,
        result: decoded.name
      }
    } else {
      return {
        status: 403,
        result: '没有授权'
      }
    }
  } catch (err) {
    if (err.message === 'invalid signature') {
      ctx.throw(clientError('小希不认可你的认证呢,重新登录看看'))
    }
    return {
      status: 503,
      result: '解密错误'
    }
  }
}

const signJwtToken = name => {
  return jwt.sign({name}, config.system.secret, {expiresIn: '7d'})
}

export const login = async (ctx, next) => {
  if (!ctx.request.body.name) {
    ctx.throw(400, '都没填用户名咋登录呀')
  }
  let service = new authService()
  let {name} = await service.login(ctx.request.body)
  ctx.body =  '登录成功'
  // setCookie
  ctx.cookies.set('token', signJwtToken(name), {httpOnly: true, maxAge: 604800000})
  next()
}

export const logout = ctx => {
  ctx.cookies.set('token', ctx.cookies.get('token'), {httpOnly: true, maxAge: -1})
  ctx.body =  '退出成功'
}

