import express from 'express'
import Joi from 'joi'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

const reportSchema = Joi.object({
  deviceId: Joi.string().required(),
  type: Joi.string().valid('SIM_CHANGE', 'OTHER').required(),
  details: Joi.string().allow('', null)
})

router.post('/report', requireAuth, async (req, res) => {
  const { error, value } = reportSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })

  const incident = await prisma.incident.create({
    data: {
      userId: req.user.id,
      deviceId: value.deviceId,
      type: value.type,
      details: value.details || null
    }
  })
  return res.status(201).json(incident)
})

router.get('/', requireAuth, async (req, res) => {
  const incidents = await prisma.incident.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  })
  return res.json(incidents)
})

export default router
