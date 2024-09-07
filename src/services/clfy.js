import config from "../config/index.js"
import sequelize from "../lib/sequelize.js";
import { logger } from "../middleware/logger.js";
import { clfy as clfyModel, voice } from "../models/index.js"
import { clientError } from "../tool/response.js"
import { randomUUID } from "crypto";
import fs from 'fs'
import path from "path";

export default function clfyService() {
  this.createClfy = async (clfy, creator) => {
    let { count } = await clfyModel.findAndCountAll({ where: { creator, owner: clfy.owner } })
    if (count > config.system.allowCreateClfyCount) {
      return Promise.reject(clientError('当前VUP下最多只能创建5个音声分类,已经创建了'+count+'个分类了'))
    }
    clfy.id = randomUUID()
    clfy.creator = creator
    let res = await clfyModel.create(clfy)
      .catch(err => {
        throw new Error('create clfy error, err:', err)
      })
    return res
  }

  this.deleteClfy = async (id) => {
    const res = await sequelize.transaction(async (t) => {
      let voiceRes = await voice.findAll({where: {clfyId: id}, transaction: t})
      let name = new Set()
      voiceRes.forEach(v => {
        name.add(v.creator)
      })
      if (name.size > 1) {
        return Promise.reject(clientError('不能删除分类，因为还有其他人上传的音声呢'))
      }
      let clfyRes = await clfyModel.findByPk(id)
      if (!clfyRes) {
        return Promise.reject(clientError('删除的分类不存在呢'))
      }
      // 删除音声
      voiceRes.forEach(v => {
        // 音声文件和数据库记录需要同步，跳过找不到的音声文件
        try {
          fs.rmSync(path.join(config.system.voicePath, v.path))
        } catch (error) {
          logger.error(`删除音声失败,数据库查询到的音声为${v.path},但找不到音声文件,或删除失败 err:`, error)
        }
        voice.destroy({where: {path: v.path}, transaction: t})
      })

      // 删除分类
      await clfyModel.destroy({where: {id}, transaction: t})

    })
    return res
  }
};
