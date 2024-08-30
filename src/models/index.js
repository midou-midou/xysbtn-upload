import auth from "./auth.js";
import clfy from "./clfy.js";
import voice from "./voice.js";

;(async function initModel() {
  await auth.sync()
  await clfy.sync()
  await voice.sync()
})()

export {auth, clfy, voice}