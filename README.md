# xysbtn-upload
虚研社按钮音声上传工具-后端  
前端项目: [voice-upload-panel](https://github.com/midou-midou/voice-upload-panel)  

## 开发  
* node版本 >= 20.11.0  
### 配置  
1. 安装依赖
1. 指定数据库连接 `src/config/index.js`中的`db.url`配置项
2. 项目根目录添加文件`secret.pub`作为jwt签名密钥  
3. 项目根目录创建`voices`和`uploadTmp`文件夹
4. 运行`yarn dev`

## 部署
### Docker部署 (推荐方式)  
1. 需要在`docker-compose.yml`中修改`xysbtn-upload`服务下的挂载目录及挂载的文件(修改成自己的目录)
```yaml
services:
  ...
  xysbtn-upload:
    ...
    volumes:
      # 证书的目录
      - /root/xysbtn/xysbtn_upload/certs:/app/certs
      # jwt签名密钥
      - /root/xysbtn/xysbtn_upload/secret.pub:/app/secret.pub
      # 上传的音声
      - /root/xysbtn/voice:/app/voices
```
2. 证书命名规范及添加  
证书需要以**域名**作为名字 eg. `upload.xuyanshe.club.pem`或者`upload.xuyanshe.club.key`  
证书需要添加到 **证书的目录** 中去(和上面`docker-compose.yml`文件中配置的目录一致)
3. 配置域名  
在`src/config/index.js`中配置，**配置的域名需要和证书命名一致**
```js
system: {
  // 需要修改下面三个配置项 协议、域名、端口
  api_server_type: 'https://',
  api_server_host: 'upload.xuyanshe.club',
  api_server_port: '3000',
  ...
},
```
4. 配置jwt签名密钥  
指定自己的签名密钥，密钥位置需要和上面`docker-compose.yml`文件中配置的目录一致
5. 运行  
在**项目根目录**下，使用命令`docker-compose up -d`
6. 初始化sql
根据自己需求来，需要使用 [虚研社按钮](https://voice.xuyanshe.club) 已有音声，可以进入`xysbtn-upload`容器执行`sql/tool/index.js`文件