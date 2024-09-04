import { logger } from "../middleware/logger.js";
import {auth as authModel} from "../models/index.js";

export default function authService(){
  this.uploaderName = ''

  this.login = async ({name}) => {
    // uploader不存在
    let [uploader] = await authModel.findOrCreate({where: {name}})
      .catch((err) => {
        throw new Error('login error, err:', err)
      })
    return uploader
  }

  this.getUploader = async (name = '') => {
    let uploader = await authModel.findOne({where: {name}})
    .catch((err) => {
      throw new Error('get uploader error, err:', err)
    })
    if (!uploader) {
      throw new Error('没有找到用户名为', name, '的用户')
    }
    return uploader.name
  }

}