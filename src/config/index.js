import path from 'path'

export default {
  system: {
    api_server_type: 'https://', // API服务器协议类型,包含"http://"或"https://"
    api_server_host: 'upload.xuyanshe.club', // API服务器暴露的域名地址,请勿添加"http://"
    api_server_port: '3000', // API服务器监听的端口号
    System_country: 'zh-cn', // 所在国家的国家代码
    System_plugin_path: path.join('./plugins'), // 插件路径
    Session_Key: 'RESTfulAPI', // 生产环境务必随机设置一个值
    voicePath: path.join(import.meta.dirname, '../../voices'),
    uploadTmpPath: path.join(import.meta.dirname, '../../uploadTmp'),
    xysbtn_origin: 'https://voice.xuyanshe.club',
    voiceSizeLimit: 512 * 1024 // KB
  },
  db: {
    url: 'postgres://xysbtn:m6MOjZzM@localhost:5432/xysbtn_db',
    prefix: 'api_' // 默认"api_"
  }
}