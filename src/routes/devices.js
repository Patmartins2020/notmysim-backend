import express from 'express'
import Joi from 'joi'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

const registerSchema = Joi.object({
  deviceId: Joi.string().min(3).required(),
  imsiHash: Joi.string().min(10).required(),
  iccidHash: Joi.string().min(10).required(),
  carrier: Joi.string().allow('', null)
})

router.post('/register', requireAuth, async (req, res) => {
  const { error, value } = registerSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })

  const device = await prisma.device.create({
    data: {
      userId: req.user.id,
      deviceId: value.deviceId,
      imsiHash: value.imsiHash,
      iccidHash: value.iccidHash,
      carrier: value.carrier || null
    }
  })
  return res.status(201).json(device)
})

export default router
