import fs from 'fs'
import path from 'path'
import { default as config } from '../config/index.js'

export default (ctx) => {
  // 文件将要上传到哪个文件夹下面
  let uploadPath = config.system.voicePath
  let voices = ctx.request.body.files

  // 获取文件类型
  var type = voices.file.type

  // 获取文件名，并根据文件名获取扩展名
  var filename = voices.file.name
  var extname = filename.lastIndexOf('.') >= 0 ? filename.slice(filename.lastIndexOf('.') - filename.length) : ''
  // 文件名没有扩展名时候，则从文件类型中取扩展名
  if (extname === '' && type.indexOf('/') >= 0) {
    extname = '.' + type.split('/')[1]
  }
  // 将文件名重新赋值为一个随机数（避免文件重名）
  filename = Math.random().toString().slice(2) + extname

  // 构建将要存储的文件的路径
  var filenewpath = path.join(uploadPath, filename)

  var result = ''

  // 将临时文件保存为正式的文件
  try {
    fs.renameSync(tempfilepath, filenewpath)
  } catch (err) {
    if (err) {
      // 发生错误
      console.log('fs.rename err')
      result = 'error|save error'
    }
  }
  // 保存成功
  console.log('fs.rename done')
  // 拼接url地址
  result = config.system.api_server_type + config.system.api_server_host + ':' + config.system.api_server_port + '/assets/uploads' + filename

  // 返回结果
  ctx.body = result
}
