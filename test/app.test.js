// import app from '../src/app'
import fetch from "node-fetch"

const baseUrl = 'localhost:3000'

describe('API测试', () => {
  test('login接口测试返回200',async () => {
    const data = await (await fetch(baseUrl+'/login')).json()
    expect(data).toBe({})
  })
})
