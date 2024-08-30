import { logger } from "../middleware/logger.js";
import {auth as authModel} from "../models/index.js";

export default function authService(){
  this.uploaderName = ''

  this.login = async ({name}) => {
    // uploader不存在
    let [uploader] = await authModel.findOrCreate({where: {name}})
      .catch((err) => {
        logger.error('login err, err:', err)
        throw err
      })
    return uploader
  }

}