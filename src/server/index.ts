import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import express, { json, urlencoded } from 'express'
import routes from '../routes'
import cookieParser from 'cookie-parser'
import deserializeUser from '../middleware/deserializeUser'
import http from 'http'
const app = express()
const server = http.createServer(app)

app.use(cookieParser())
app.use(json())
app.use(
  cors({
    origin: ['http://localhost:3000','http://agrimate.unikomcodelabs.id'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'X-Access-Token',
      'X-Key',
      'Cookies',
      'Cache-Control',
      'Set-Cookie'
    ],
    credentials: true
  })
)

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
)

app.use(urlencoded({ extended: true }))
app.use('/image', express.static(path.join(__dirname, '../../public/uploads')))
app.use(deserializeUser)
app.use(routes)

export default server
