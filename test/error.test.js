const request = require('supertest')
const expect = require('chai').expect
const app = require('../app/index.js')
const Config = require('../config/config')


describe('API', () => {
    const inst = app.listen(Config.port)

    describe('GET /api/mina/v1/rcmd', () => {
        it('获取推荐列表', async() => {
            const res = await request(inst).get('/api/mina/v1/rcmd')
            expect(res.status).to.equal(200)
        })
    })
})