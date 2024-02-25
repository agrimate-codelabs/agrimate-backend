import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../server'

chai.use(chaiHttp)
const expect = chai.expect

describe('Commodity', () => {
  it('should get data from commodities', async () => {
    const response = await chai.request(app).get('/commodity') // Ganti dengan endpoint yang sesuai
    expect(response).to.have.status(200)
    expect(response.body).to.have.property('status', 'success')
  })
})
