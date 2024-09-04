import { logger } from "./logger.js"

export default function () {
  return function (ctx, next) {
    return next().catch((err) => {
      logger.error('status:', err.status, `${ctx.method} ${ctx.url} ErrorReason: ${err}`)
      switch (err.status) {
        case 401:
          ctx.throw(401, '需要重新登录一下了')
          break
        default:
          throw err
      }
    })
  }
}
