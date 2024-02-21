import express from 'express'
import insertDetails from '../controllers/user/insertDetails.js'
import fetchDetails from '../controllers/user/fetchDetails.js'
import insertFallData from '../controllers/user/insertfalldata.js'
import fetchFallData from '../controllers/user/fetchFallData.js'
import insertImage from '../controllers/user/insertImage.js'

const router = express.Router()

router.post('/user', insertDetails)
router.get('/user', fetchDetails)
router.post('/fall',insertFallData)
router.get('/fall',fetchFallData)
router.post('/fall',insertImage)
router.get('/fall',fetchImage)
export default router