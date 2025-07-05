import auth from "./auth.js";
import clfy from "./clfy.js";
import voice from "./voice.js";

// 创建关联关系
voice.belongsTo(clfy, {foreignKey: 'clfyId', targetKey: 'id'})
clfy.hasMany(voice, { foreignKey: 'clfyId' })

;(async function initModel() {
  await auth.sync()
  await clfy.sync()
  await voice.sync()
})()

export {auth, clfy, voice}