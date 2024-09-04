import {logger} from "../middleware/logger.js";
import { clfy, voice } from "../models/index.js";
import fs from 'fs'
import config from "../config/index.js";
import sequelize from "../lib/sequelize.js";
import { randomUUID } from "crypto";
import path from "path";

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

  this.uploadVoice = async (voices) => {
    for (let key in voices) {
      this.tmpVoices.push(voices[key])
      voices[key].status = 'upload_failed'
      
      // 类型判断
      if (voices[key].type !== 'audio/mpeg') {
        voices[key].res = '音声类型不对呢'
        continue
      }
      
      // 大小限制
      if (voices[key].size > config.system.voiceSizeLimit) {
        voices[key].res = '音声过大了'
        continue
      }
      // 同一批上传的音声中去重
      if (this.tmpVoices.includes(v => v.name === voices[key].name)) {
        voices[key].res = '检查下当前上传的音声中是不是有重复的'
        continue
      }

      voices[key].target = path.join(config.system.voicePath, voices[key].name)
      voices[key].tmpPath = voices[key].path
    }

    return voices
  }

  this.checkVoiceInfo = async (voices = []) => {
    const res = await sequelize.transaction(async (t) => {
      for (let v of voices) {
        // 分类检查
        let clfyRes = await clfy.findByPk(v.clfyId)
        if (!clfyRes) {
          v.status = 'upload_failed'
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
      return voices
    })
      .catch((err) => {
        throw new Error('batch create voices error, err:', err)
      })
    return res
  }

  this.renameVoices = () => {
    this.tmpVoices.forEach(v => {
      if (v.status === 'success') {
        fs.renameSync(v.path, v.target)
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

  this.deleteVoice = async (voiceName) => {
    if (!fs.existsSync(path.join(config.system.voicePath, voiceName))) {
      throw new Error('删除的音声不存在呢')
    }
    let voiceRes = await voice.destroy({where: {path: voiceName}})
  }
};
