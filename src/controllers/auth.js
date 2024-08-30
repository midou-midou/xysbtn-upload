import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import authService from '../services/auth.js'
import { responseData } from '../tool/response.js'

const publicKey = fs.readFileSync(path.join(import.meta.dirname, '../../publicKey.pub'))

// 检查jwt是否合法
const checkAuth = (ctx, next) => {
  // const token = ctx.request.header.authorization
  const token = ctx.cookies.get('token')
  try {
    const decoded = jwt.verify(token, publicKey)
    if (decoded.name) {
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
    return {
      status: 503,
      result: '解密错误'
    }
  }
}

const signJwtToken = (name) => {
  return jwt.sign({name}, publicKey, {expiresIn: '7d'})
}

export const login = async (ctx, next) => {
  try {
    let service = new authService()
    let {name} = await service.login(ctx.request.body)
    ctx.body = responseData(200, '登录成功')
    // setCookie
    ctx.cookies.set('token', signJwtToken(name), {httpOnly: true, maxAge: 604800000})
    next()
  } catch (error) {
    throw error
  }
}

export const logout = (ctx, next) => {
  ctx.cookies.set('token', ctx.cookies.get('token'), {httpOnly: true, maxAge: -1})
  ctx.body = responseData(200, '退出成功')
}

export const Post = (ctx, next) => {
  switch (ctx.params.action) {
    case 'check':
      return checkAuth(ctx).then(result => { ctx.body = result; next() })
    default:
      return checkAuth(ctx).then(result => { ctx.body = result; next() })
  }
}
