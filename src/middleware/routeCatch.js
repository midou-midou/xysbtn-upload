export default function () {
  return function (ctx, next) {
    return next().catch((err) => {
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
