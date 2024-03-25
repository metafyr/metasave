import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import dotenv from 'dotenv'
import { userOperation } from '../../helpers/userOperation.js'
import { abi } from '../../abi/index.js'
import AA from '../../helpers/aa.js'
import { addresses } from '../../constants/addresses.js'
import sendMessage from '../../helpers/whatsapp/sendMessage.js'
import { ethers } from 'ethers'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
const admin_priv_key = process.env.ADMIN_PRIV_KEY

const insertFall = async (req, res) => {
  try {
    let imgIPFSid = ''
    let dataIPFSid = ''
    const imagePath = `./uploads/${req.body.username}/image.jpg`
    console.log('preduction data:', req.body.prediction_data)
    const AAProvider = await AA(req.body.PRIV_KEY)

    // Upload image to IPFS
    if (fs.existsSync(imagePath)) {
      const formDataImage = new FormData()
      formDataImage.append('file', fs.createReadStream(imagePath))

      imgIPFSid = await uploadToIPFS(formDataImage, 'file')
      console.log('Image IPFS ID:', imgIPFSid)
    } else {
      console.log('Image file does not exist:', imagePath)
    }

    dataIPFSid = await uploadToIPFS(
      JSON.parse(req.body.prediction_data),
      'json'
    )

    console.log('Data IPFS ID:', dataIPFSid)

    // Store fall data on blockchain
    const PRIV_KEY = req.body.PRIV_KEY
    const CFAddress = await AAProvider.getAddress()
    const txHash = await userOperation(
      abi.MetaSave,
      'setFallData',
      [CFAddress, imgIPFSid, dataIPFSid],
      addresses.MetaSave,
      PRIV_KEY
    )

    const provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-mumbai.g.alchemy.com/v2/35QDaNc7wH9sOfTbC79sDDvsK_dmyZPj'
    )
    const contractAddress = addresses.MetaSave
    const privateKey = req.body.PRIV_KEY
    const wallet = new ethers.Wallet(`0x${privateKey}`, provider)
    const contract = new ethers.Contract(contractAddress, abi.MetaSave, wallet)
    const ipfsid = await contract.getIPFSFileName(CFAddress)
    const fallData = await contract.getFallData(CFAddress)

    console.log('ipfs id:', ipfsid)
    console.log('fallData:', fallData)
    console.log('falllength:', fallData.length)
    console.log('lastfallData:', fallData[fallData.length - 1])
    const lastFallData = fallData[fallData.length - 1]
    const lastimgIPFSid = lastFallData[0]
    console.log('lastimgIPFSid:', lastimgIPFSid)

    const details = await axios.get(`${PINATA_BASE_URL}/ipfs/${ipfsid}`)
    const img = `${PINATA_BASE_URL}/ipfs/${lastimgIPFSid}`
    //console.log('img:', img)
    console.log('details:', details.data)
    console.log('phones:', details.phone)
    const falldetails = JSON.parse(req.body.prediction_data)

    for (let i = 0; i < details.data.contacts.length; i++) {
      let ph = details.data.contacts[i].phoneNumber
        .replace(' ', '')
        .replace('+', '')
      const res = sendMessage(
        img,
        details.data.name,
        ph,
        falldetails.timestamp,
        falldetails.date
      )
      if (!res) {
        console.log('Error sending message to', details.data.phone[i])
      }
    }

    res.send({
      imgIPFSid,
      dataIPFSid,
      txHash,
    })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).send({ error: err.message })
  }
}

async function uploadToIPFS(data, type) {
  try {
    if (type === 'json') {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
          headers: {
            Authorization: `Bearer ${PINATA_API_KEY}`,
          },
        }
      )
      return response.data.IpfsHash
    } else if (type === 'file') {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data,
        {
          headers: {
            ...data.getHeaders(),
            Authorization: `Bearer ${PINATA_API_KEY}`,
          },
          maxBodyLength: 'Infinity',
        }
      )
      return response.data.IpfsHash
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error('Failed to upload to IPFS.')
  }
}

export default insertFall
