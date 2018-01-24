const request = require('supertest')
const expect = require('chai').expect
const app = require('../app/index.js')


describe('API', () => {
  const inst = app.listen(4000)

  describe('GET /api/error', () => {
    it('应该报500错误', async () => {
        const res = await request(inst).get('/api/error')
        expect(res.status).to.equal(500)
    })
  })
})
