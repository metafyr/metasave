import express from 'express'
import userMerkleTree from '../controllers/merkleTree/user/index.js'
import deviceMerkleTree from '../controllers/merkleTree/device/index.js'

const router = express.Router()

router.post('/userMerkletree', userMerkleTree)
router.post('/deviceMerkletree', deviceMerkleTree)

export default router
