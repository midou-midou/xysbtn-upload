import auth from "./auth";
import clfy from "./clfy";
import voice from "./voice";

;(async function initModel() {
  await auth.sync()
  await clfy.sync()
  await voice.sync()
})()

export {auth, clfy, voice}