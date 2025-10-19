import express from 'express'
import Joi from 'joi'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma.js'

const router = express.Router()

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

router.post('/register', async (req, res) => {
  const { error, value } = registerSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })

  const existing = await prisma.user.findUnique({ where: { email: value.email } })
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const hashed = await bcrypt.hash(value.password, 12)
  const user = await prisma.user.create({
    data: { email: value.email, password: hashed }
  })
  return res.status(201).json({ id: user.id, email: user.email, createdAt: user.createdAt })
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })

  const user = await prisma.user.findUnique({ where: { email: value.email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(value.password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '7d' })
  return res.json({ token })
})

export default router
