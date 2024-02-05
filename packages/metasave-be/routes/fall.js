import express from 'express'
import fall from '../controllers/fall/index.js'

const router = express.Router()

router.post('/fall', fall)

export default router