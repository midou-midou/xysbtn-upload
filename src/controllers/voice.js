import voiceService from "../services/voice.js";
import { dataToView } from "../tool/voice.js";

export const listVoice = async (ctx, next) => {
  let service = new voiceService()
  if (!ctx.request.query.owner) {
    ctx.throw(400, 'bad request: "owner" property must be have or not empty')
  }
  let voices = await service.listVoice(ctx.request.query.owner)
  ctx.body = {[ctx.request.query.owner]: dataToView(voices)}
}