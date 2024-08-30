import {logger} from "../middleware/logger.js";
import { voice } from "../models/index.js";

export default function voiceService() {
  this.listVoice = async (vupName = '') => {
    let voices = await voice.findAll({where: {owner: vupName}})
      .catch((err) => {
        logger.error('list vup voice err, err:', err)
        throw err
      })
    return voices
  }
};
