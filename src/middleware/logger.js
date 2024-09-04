import log4js from 'log4js'

// 日志配置对象
log4js.configure({
  // 日志记录方式
  appenders: {
    console: {
      type: "console",
      layout: {
        // 开发环境下带颜色输出，生产环境下使用基本输出
        type: process.env.NODE_ENV === 'production' ? 'basic' : 'coloured'
      }
    }
  },

  // log4js.getLogger(type)：就是读取这里的key
  categories: {
    default: { appenders: ['console'], level: 'all' }
  },

  replaceConsole: true
})

let log = {}

// 生成一个控制台类型的日志记录器
let console = log4js.getLogger()

log.log = console

export const logger = console

export const loggerMiddleware = () => {
  return async (ctx, next) => {
    const start = new Date()
    await next()
    let end = new Date() - start
    logger.info(`${ctx.method} ${ctx.url} ${ctx.ip} - ${end}ms`)
  }
}