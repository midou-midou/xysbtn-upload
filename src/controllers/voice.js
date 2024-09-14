import jwt from 'jsonwebtoken'
import voiceService from "../services/voice.js";
import { dataToView, mergeVoice } from "../tool/voice.js";
import { checkAuth } from "./auth.js";
import config from '../config/index.js';

export const listVoice = async ctx => {
  let service = new voiceService()
  if (!ctx.request.query.owner) {
    ctx.throw(400, 'bad request: "owner" property must be have or not empty')
  }
  const decode = ctx.cookies.get('token') ? jwt.verify(ctx.cookies.get('token'), config.system.secret) : ''
  let voices = await service.listVoice(ctx.request.query.owner, decode.name)
  ctx.body = {[ctx.request.query.owner]: dataToView(voices)}
}

export const playVoice = async ctx => {
  if (!ctx.params.path) {
    ctx.throw(400, '找不到播放的音声')
  }
  let service = new voiceService()
  ctx.body = await service.playVoice(ctx.params.path)
}

export const uploadVoices = async ctx => {
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
    // 合并下音声信息和上传的音声
    let voices = mergeVoice(ctx.request.files, JSON.parse(ctx.request.body.voices))
    // 上传校验
    voices = service.uploadVoice(voices)
    // 音声信息校验
    let checkedVoices = await service.checkVoiceInfo(voices)
    checkedVoices.forEach(v => v.creator = result);
    ctx.body = await service.batchCreateVoices(checkedVoices)
    // 临时文件移动到音声文件夹
    service.renameVoices()
  } catch (error) {
    ctx.throw(500, error)
  } finally {
    service.cleanVoices()
  }

}

export const deleteVoice = async ctx => {
  let {status, result} = await checkAuth(ctx)
  if (status !== 1) {
    ctx.throw(status, result)
  }
  if (!ctx.request.body.name) {
    ctx.throw(400, '删除音声有问题，重新试试呢')
  }

  let service = new voiceService()
  await service.deleteVoice(ctx.request.body.name, result)
  ctx.body = '删除音声成功'
}