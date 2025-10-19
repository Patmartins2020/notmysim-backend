import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import deviceRoutes from './routes/devices.js'
import incidentRoutes from './routes/incidents.js'
import actionRoutes from './routes/actions.js'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/auth', authRoutes)
app.use('/devices', deviceRoutes)
app.use('/incidents', incidentRoutes)
app.use('/actions', actionRoutes)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`NotMySim backend listening on :${PORT}`))
