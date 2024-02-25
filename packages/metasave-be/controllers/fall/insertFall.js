import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import dotenv from 'dotenv'
import { userOperation } from '../../helpers/userOperation.js'
import { abi } from '../../abi/index.js'

dotenv.config()

const PINATA_API_KEY = process.env.PINATA_API_KEY

const insertFall = async (req, res) => {
  try {
    let imgIPFSid = ''
    let dataIPFSid = ''
    const imagePath = `./uploads/${req.body.username}/image.jpg`

    // Upload image to IPFS
    if (fs.existsSync(imagePath)) {
      const formDataImage = new FormData()
      formDataImage.append('file', fs.createReadStream(imagePath))

      imgIPFSid = await uploadToIPFS(formDataImage, 'file')
      console.log('Image IPFS ID:', imgIPFSid)
    } else {
      console.log('Image file does not exist:', imagePath)
    }

    dataIPFSid = await uploadToIPFS(req.body.prediction_data, 'json')
    console.log('Data IPFS ID:', dataIPFSid)

    res.send({
      imgIPFSid,
      dataIPFSid,
      txHash: 'Blockchain interaction not implemented',
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
