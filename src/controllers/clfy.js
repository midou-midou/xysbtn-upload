import clfyService from "../services/clfy.js"
import { checkAuth } from "./auth.js"

export const createClfy = async ctx => {
  let {status, result} = await checkAuth(ctx)
  if (status !== 1) {
    ctx.throw(status, result)
  }
  if (!ctx.request.body) {
    ctx.throw(400, '分类信息填写的不全呢')
  }
  let service = new clfyService()
  let res = await service.createClfy(ctx.request.body, result)
  ctx.body = res
}

export const deleteClfy = async ctx => {
  let {status, result} = await checkAuth(ctx)
  if (status !== 1) {
    ctx.throw(status, result)
  }
  if (!ctx.request.body.id) {
    ctx.throw(400, '分类信息填写的不全呢')
  }
  let service = new clfyService()
  let res = await service.deleteClfy(ctx.request.body.id)
  ctx.body = res ? res : '删除成功'
}