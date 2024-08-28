import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import authService from '../services/auth'

const publicKey = fs.readFileSync(path.join(__dirname, '../../publicKey.pub'))

// 用户登录的时候返回token
// let token = jwt.sign({
//   userInfo: userInfo // 你要保存到token的数据
// }, publicKey, { expiresIn: '7d' })

/**
 * 检查授权是否合法
 */
const checkAuth = (ctx, next) => {
  const token = ctx.request.header.authorization
  try {
    const decoded = jwt.verify(token.substr(7), publicKey)
    if (decoded.userInfo) {
      return {
        status: 1,
        result: decoded.userInfo
      }
    } else {
      return {
        status: 403,
        result: {
          errInfo: '没有授权'
        }
      }
    }
  } catch (err) {
    return {
      status: 503,
      result: {
        errInfo: '解密错误'
      }
    }
  }
}

export const login = (ctx, next) => {
  // throw new Error('自定义抛出错误')
  // ctx.body = '登录成功'
  authService()
  next()
}

export const logout = (ctx, next) => {

}

export const Post = (ctx, next) => {
  switch (ctx.params.action) {
    case 'check':
      return checkAuth(ctx).then(result => { ctx.body = result; next() })
    default:
      return checkAuth(ctx).then(result => { ctx.body = result; next() })
  }
}
