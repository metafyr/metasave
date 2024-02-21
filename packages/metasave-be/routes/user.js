import express from 'express'
import insertDetails from '../controllers/user/insertDetails.js'
import fetchDetails from '../controllers/user/fetchDetails.js'
import insertFallData from '../controllers/user/insertfalldata.js'
import fetchFallData from '../controllers/fall/fetchFallData.js'
import insertImage from '../controllers/fall/insertImage.js'

const router = express.Router()

router.post('/user', insertDetails)
router.get('/user', fetchDetails)

export default router