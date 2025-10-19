import express from 'express'
import Joi from 'joi'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

const panicSchema = Joi.object({
  deviceId: Joi.string().required(),
  checklist: Joi.array().items(Joi.string().min(2)).min(1).required()
})

router.post('/panic', requireAuth, async (req, res) => {
  const { error, value } = panicSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })

  const action = await prisma.panicAction.create({
    data: {
      userId: req.user.id,
      deviceId: value.deviceId,
      checklist: value.checklist
    }
  })
  return res.status(201).json(action)
})

export default router
