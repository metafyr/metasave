import express from 'express'
import insertFall from '../controllers/fall/insertFall.js'
import fetchFallData from '../controllers/fall/fetchFallData.js'
import multer from 'multer'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
// import { userOperation } from '../helpers/userOperation.js'
import { abi } from '../abi/index.js'
import { addresses } from '../constants/addresses.js'
import { ethers } from 'ethers'
import keccak256 from 'keccak256'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ALCHEMY_API_URL = process.env.ALECHMY_API_URL


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.username
    const uploadsDir = path.join(__dirname, `../uploads/${username}`)
    fs.mkdirSync(uploadsDir, { recursive: true })
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    cb(null, 'image.jpg')
  },
})

const upload = multer({ storage: storage })

const verifyFallTrigger = async(req, res) => {
  upload.single('file')
  const filePath = 'constants/deviceproof'
  const proof = fs.readFileSync(filePath)
  const privKey = req.body.PRIV_KEY
  
  const provider = new ethers.providers.JsonRpcProvider(
    ALCHEMY_API_URL,
  )

  const msg = keccak256(privKey)
  const PRIV_KEY = req.body.PRIV_KEY
  const wallet = new ethers.Wallet(`0x${PRIV_KEY}`, provider)
  const contract = new ethers.Contract(addresses.ZKProof, abi.ZKProof, wallet)
  const verify = await contract.verify(proof, msg)

  if(verify){
    next()
  }

}

const router = express.Router()

router.post('/fall', verifyFallTrigger, insertFall)
router.get('/falldata', fetchFallData)

export default router
