import {logger} from "../middleware/logger.js";
import { clfy, voice } from "../models/index.js";

export default function voiceService() {
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
};
