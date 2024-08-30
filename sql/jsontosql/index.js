import path from "path";
import { voice, clfy } from "../../src/models/index.js";
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
          clfy: c.clfy.id
        })
      }
    }
  }
})

const t = await sequelize.transaction();

// console.log('clfys', clfys);

// console.log('voices', voices);

// clfy to db
try {
  for (let c of clfys) await clfy.create(c, { transaction: t });
  await t.commit();

} catch (error) {
  logger.error(error)
  await t.rollback();
}


// voice to db
try {
  for (let v of voices) await voice.create(v, { transaction: t });
  await t.commit();

} catch (error) {
  logger.error(error)
  await t.rollback();
}