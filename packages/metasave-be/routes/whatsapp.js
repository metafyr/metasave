import express from 'express'
import whatsappVerify from '../controllers/whastsapp/verify.js'
import whatsappNotification from '../controllers/whastsapp/notification.js'

const router = express.Router()

router.get('/webhook', whatsappVerify)
router.post('/notification', whatsappNotification)

export default router