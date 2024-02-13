import express from 'express'
import whatsappVerify from '../controllers/whatsapp/verify.js'
import whatsappNotification from '../controllers/whatsapp/notification.js'

const router = express.Router()

router.get('/webhook', whatsappVerify)
router.post('/notification', whatsappNotification)

export default router