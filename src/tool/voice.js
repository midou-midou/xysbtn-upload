export const dataToView = (voices = []) => {
  if (voices.length === 0) return
  let view = []
  let clfys = new Map()
  
  for (let v of voices) {
    let clfyVoice = []
    if (clfys.get(v.clfy.id)) {
      clfyVoice = [...clfys.get(v.clfy.id)?.voice]
    }

    clfys.set(v.clfy.id, {
      clfy: v.clfy,
      voice: [...clfyVoice, {
        id: v.id,
        creator: v.creator,
        path: v.path,
        desc: v.desc
      }]
    })
  }

  clfys.forEach((v) => {
    view.push(v)
  })

  return view
}

export const mergeVoice = (uploadVoices = {}, voicesInfo = []) => 
  voicesInfo.map(voiceInfo => {
    for (let key in uploadVoices) {
      if (uploadVoices[key].name === voiceInfo.path) {
        let res = {res: uploadVoices[key].res, status: uploadVoices[key].status}
        return Object.assign(res, voiceInfo)
      }
    }
  })