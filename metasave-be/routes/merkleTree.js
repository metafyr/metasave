import express from 'express'
import merkleTree from '../controllers/merkleTree/index.js'

const router = express.Router()

router.post('/merkletree', merkleTree)

export default router