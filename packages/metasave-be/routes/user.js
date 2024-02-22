import express from 'express'
import insertDetails from '../controllers/user/insertDetails.js'
import fetchDetails from '../controllers/user/fetchDetails.js'

const router = express.Router()

router.post('/user', insertDetails)
router.get('/user/:cid', fetchDetails)

export default router