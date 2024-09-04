import voiceService from "../services/voice.js";
import { dataToView, mergeVoice } from "../tool/voice.js";
import { checkAuth } from "./auth.js";
import config from '../config/index.js'

export const listVoice = async (ctx, next) => {
  let service = new voiceService()
  if (!ctx.request.query.owner) {
    ctx.throw(400, 'bad request: "owner" property must be have or not empty')
  }
  let voices = await service.listVoice(ctx.request.query.owner)
  ctx.body = {[ctx.request.query.owner]: dataToView(voices)}
}

export const playVoice = async (ctx, next) => {
  
}

export const uploadVoices = async (ctx) => {
  let {status, result} = await checkAuth(ctx)
  if (status !== 1) {
    ctx.throw(status, result)
  }
  if (!ctx.request.files) {
    ctx.throw(400, '要先上传一个音声哦')
  }
  if (!ctx.request.body.voices || ctx.request.body.voices.length === 0) {
    ctx.throw(400, '音声信息没有解析到，重新上传试试呢')
  }

  let service = new voiceService()

  try {
    let uploadVoices = await service.uploadVoice(ctx.request.files)

    let voices = await service.checkVoiceInfo(JSON.parse(ctx.request.body.voices))
    voices.forEach(v => v.creator = result);
    let respVoice = await service.batchCreateVoices(voices)

    ctx.body = mergeVoice(uploadVoices, respVoice)

    service.renameVoices()
  } catch (error) {
    ctx.throw(500, error)
  } finally {
    service.cleanVoices()
  }

}