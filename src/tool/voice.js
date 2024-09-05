import fs from 'fs'

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

export const mergeVoice = (uploadVoices = {}, voicesInfoList = []) => {
  // 去重
  let waitUpload = []
  let repeat = []

  const mergeFileToInfo = (file, info) => {
    let {res, status, name, path, size, type} = file
    waitUpload = [...waitUpload, Object.assign({res, status, name, tmpPath: path, size, type}, info)]
  }

  voicesInfoList.forEach(voiceInfo => {
    let file = uploadVoices[voiceInfo.path+voiceInfo.clfyId]
    if (!file) return
    if (waitUpload.filter(item => item.path === voiceInfo.path && item.clfyId === voiceInfo.clfyId).length > 0) return
    // 如果formData key重复，会自动合并为一个数组作为此key的value
    if (Array.isArray(file)) {
      file.map((v, k) => {
        if (k === 0) {
          mergeFileToInfo(v, voiceInfo)
          return
        }
        repeat.push(v)
      })
    } else {
      mergeFileToInfo(file, voiceInfo)
    }
  })

  // 清理多余上传的音声
  repeat.forEach(v => {
    fs.rmSync(v.path)
  })

  return waitUpload
}