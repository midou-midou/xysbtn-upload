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

  this.listVoice = async (vupName = '') => {
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
    return voices
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
        let clfyRes = await clfy.findByPk(v.clfyId)
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
        let voiceRes = await voice.findOne({where: {path: v.path, clfyId: v.clfyId}, transaction: t})
        if (voiceRes) {
          v.status = 'upload_failed'
          v.res = '这个分类下已经上传过这个音声了'
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
    if (!fs.existsSync(path.join(config.system.voicePath, name))) {
      return Promise.reject(clientError('服务器上找不到你要删除的音声呢'))
    }
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
    fs.rmSync(path.join(config.system.voicePath, name))
  }

  this.playVoice = async (name) => {
    let voicePath = path.join(config.system.voicePath, name)
    if (!fs.existsSync(voicePath)) {
      return Promise.reject(clientError('要播放的音声不存在呢'))
    }
    return fs.readFileSync(voicePath)
  }
};
