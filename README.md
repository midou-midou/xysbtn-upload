# xysbtn-upload 
### 虚研社按钮音声-后端  
其他关联项目
* 虚研社按钮 [xuyanshe-voice-button](https://github.com/midou-midou/xuyanshe-voice-button)  
* 上传站项目 [voice-upload-panel](https://github.com/midou-midou/voice-upload-panel)  

## 功能
* 上传、管理音声

## 要求  
* **node版本 >= 20.11.0**  
## 配置  
1. 在`.env`文件中修改  

    ```dosini
      XYSBTN_WORKPLACE = 后端读取证书、存放音声，jwt校验密钥文件的路径，必须是绝对路径
      API_SERVER_URL = API对外访问的地址
      PG_URL = 数据库连接URL
    ```  

2. 配置jwt校验密钥  
`.env`文件`XYSBTN_WORKPLACE`配置项指定的目录下，创建名为`secret`的文件夹，之后把密钥文件放进去(文本文件即可)，内容为普通字符串(自己生成密钥)  

3. 证书  
`.env`文件`XYSBTN_WORKPLACE`配置项指定的目录下，创建名为`certs`的文件夹，并把你自己的证书文件放进去  
**注意: 证书文件要以`.pem`和`.key`结尾的**，且要在`src/config`下修改`ssl`配置项为`true``


## 部署
### Docker部署 (推荐方式)  
1. 克隆项目
2. 运行  
在**克隆的项目根目录**下，使用命令`docker-compose up -d`
3. 初始化sql  
如需要使用 [虚研社按钮](https://voice.xuyanshe.club) 已有音声，执行下面命令  

    ```sh
    docker exec xysbtn-upload node sql/tool/voicebtnJson2db.js
    ```

## 提交
如果有新功能请提交**dev**分支