import express from 'express'
import aa from '../controllers/aa/index.js'

const router = express.Router()

router.post('/aa', aa)

export default router