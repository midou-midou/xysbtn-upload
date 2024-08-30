import {auth as authModel} from "../models/index.js";

export default function authService(){
  this.uploaderName = ''

  const createUploader = async (name = '') => {
    return await authModel.create({name})
  }

  this.login = async ({name}) => {
    // uploader不存在
    let [uploader] = await authModel.findOrCreate({where: {name}})
    return uploader
  }



  // const uplaoders = await authModel.findAll()
  // console.log('data res:', uplaoders);
}