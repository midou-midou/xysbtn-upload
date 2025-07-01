import {logger} from "../middleware/logger.js";
import { clfy, voice } from "../models/index.js";
import fs from 'fs'
import config from "../config/index.js";
import sequelize from "../lib/sequelize.js";
import { randomUUID } from "crypto";
import path from "path";
import { clientError } from "../tool/response.js";

export default function voiceService() {
  this.tmpVoices = []

  this.listVoice = async (vupName = '', user) => {
    let voices = await voice.findAll({
      attributes: ['id', 'desc', 'path', 'creator', 'owner'],
      where: {owner: vupName},
      include: [{
        model: clfy
      }]
    })
      .catch((err) => {
        logger.error('list vup voice err, err:', err)
        throw err
      })
    // creator字段只填充当前用户的名字，其他人创建的音声的这个字段不填充，匿名访问都不填充这个字段
    return voices.map(v => ({
      id: v.id,
      desc: v.desc,
      path: v.path,
      owner: v.owner,
      creator: v.creator === user ? v.creator : '',
      clfy: {
        id: v.clfy.id,
        desc: v.clfy.desc,
        creator: v.clfy.creator === user ? v.clfy.creator : '',
        owner: v.clfy.owner
      }
    }))
  }

  this.uploadVoice = (voices) => {
    for (let v of voices) {
      this.tmpVoices.push(v)
      v.status = 'upload_failed'
      
      // 类型判断
      if (v.type !== 'audio/mpeg') {
        v.res = '上传的音声类型不是mp3吗'
        continue
      }
      
      // 大小限制
      if (v.size > config.system.voiceSizeLimit) {
        v.res = '音声过大了'
        continue
      }

      // 重复校验
      if (fs.existsSync(path.join(config.system.voicePath, v.name))) {
        v.res = '已经有人上传过这个音声了,可以试一试重命名这个音声后再上传'
        continue
      }

      v.target = path.join(config.system.voicePath, v.name)
      v.status = 'upload_success'
    }
    return voices
  }

  this.checkVoiceInfo = async (voices = []) => {
    const res = await sequelize.transaction(async (t) => {
      for (let v of voices) {
        // 跳过上传校验不过的音声
        if (v.status === 'upload_failed') continue
        // 分类检查
        let clfyRes = await clfy.findOne({where: {id: v.clfyId}, transaction: t})
        if (!clfyRes) {
          v.res = '这个音声的分类是不是填错了'
          continue
        }
      }
      return voices
    })
      .catch((err) => {
        throw new Error('check voice info error, err:', err)
      })
    return res
  }

  this.batchCreateVoices = async (voices = []) => {
    const res = await sequelize.transaction(async (t) => {
      for (let v of voices) {
        // 跳过上传校验、音声信息校验不过的音声
        if (v.status === 'upload_failed') continue
        // 数据库去重
        let voiceRes = await voice.findOne({where: {path: v.path}, transaction: t})
        if (voiceRes) {
          v.status = 'upload_failed'
          v.res = '已经有人上传过这个音声了'
          continue
        }
        v.id = randomUUID()
        await voice.create(v, {transaction: t})
        v.status = 'success'
      }
      return voices.map(({res, status, name}) => ({res, status, name}))
    })
      .catch((err) => {
        throw new Error('batch create voices error, err:', err)
      })
    return res
  }

  this.renameVoices = () => {
    this.tmpVoices.forEach(v => {
      if (v.status === 'success') {
        fs.renameSync(v.tmpPath, v.target)
      }
    })
  }

  this.cleanVoices = () => {
    if (this.tmpVoices.length === 0) return
    this.tmpVoices.forEach(v => {
      if (v.status !== 'success') {
        fs.rmSync(v.tmpPath)
      }
    })
  }

  this.deleteVoice = async (name, creator) => {
    let voiceRes = await voice.findOne({where: {path: name}})
    if (!voiceRes) {
      return Promise.reject(clientError('服务器上找不到你要删除的音声呢'))
    }
    if (creator !== voiceRes.creator) {
      return Promise.reject(clientError('不能删除别人的音声哦'))
    }
    await voice.destroy({where: {path: name}})
      .catch(err => {
        throw new Error('delete voice error, err:', err)
      })
    // 音声文件删除
    if (fs.existsSync(path.join(config.system.voicePath, name))) {
      fs.rmSync(path.join(config.system.voicePath, name))
    }
  }

  this.playVoice = async (name) => {
    let voicePath = path.join(config.system.voicePath, name)
    if (!fs.existsSync(voicePath)) {
      return Promise.reject(clientError('要播放的音声不存在呢'))
    }
    return fs.readFileSync(voicePath)
  }

  this.updateVoiceClfy = async ({voiceId, creator, clfyId}) => {
    let voiceRes = await voice.findOne({where: {id: voiceId}})
    if (!voiceRes) {
      return Promise.reject(clientError('服务器上找不到你要更新的音声呢'))
    }
    if (voiceRes.creator != creator) {
      return Promise.reject(clientError('不能更新其他人的音声哦'))
    }
    let clfyRes = await clfy.findOne({where: {id: clfyId}})
    if (!clfyRes) {
      return Promise.reject(clientError('要更新的音声分类不存在'))
    }
    await voice.update({clfyId}, {where: {id: voiceId}})
      .catch(err => {
        throw new Error('update voice error, err:', err)
      })
  }
};
