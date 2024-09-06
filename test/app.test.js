// import app from '../src/app'
const baseUrl = 'https://upload.xuyanshe.club:3000'

describe('Auth模块', () => {
  test('login接口测试返回200', async () => {
    const data = await fetch(baseUrl+'/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({name: 'xysbtn'})
    })
    const cookies = data.headers.get('Set-Cookie')
    expect(cookies).toBe('登录成功')
  })

  test('logout登出接口测试200', async () => {
    const data = await (await fetch(baseUrl+'/logout', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      credentials: 'include'
    })).text()
    expect(data).toBe('退出成功')
  })
})
