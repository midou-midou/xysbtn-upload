import path from "path";
import { voice, clfy, auth } from "../../src/models/index.js";
import fs from 'fs'
import { logger } from "../../src/middleware/logger.js";
import sequelize from "../../src/lib/sequelize.js";

let jsons = fs.readdirSync(path.join(import.meta.dirname, '../json'))
let owners = new Set()
let clfys = []
let voices = []

jsons.forEach((fileName) => {
  let data = fs.readFileSync(path.join(import.meta.dirname, '../json', fileName))
  let voice = JSON.parse(data.toString())
  for (let key in voice) {
    owners.add(key)
    
    for (let c of voice[key]) {
      if (c.isNew) {
        continue
      }

      clfys.push({
        id: c.clfy.id, 
        desc: JSON.stringify(c.clfy.desc), 
        creator: c.clfy.creator, 
        owner: key
      })

      for (let v of c.voice) {
        voices.push({
          id: v.id,
          desc: JSON.stringify(v.desc),
          path: v.path,
          creator: v.creator,
          owner: key,
          clfyId: c.clfy.id
        })
      }
    }
  }
})

// 这里的名字不要随便改，其他表再关联这个键
await auth.create({name: 'midou'}).catch(err => {throw new Error('初始化uploador错误'+err)})

// console.log('clfys', clfys);

// console.log('voices', voices);

;(async () => {
  try {
    await sequelize.transaction(async (t) => {
      for (let c of clfys) {
        await clfy.create(c, { transaction: t });
      }
    });
  } catch (error) {
    logger.error(error)
  }
})().then(async () => {
  await sequelize.transaction(async (t) => {
    for (let v of voices) await voice.create(v, { transaction: t });
  });
}).catch((error) => {
  logger.error(error)
})

