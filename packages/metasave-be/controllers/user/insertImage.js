import axios from 'axios'
import { FormData } from "formdata-node"
import dotenv from 'dotenv'
const fs = require('fs')

dotenv.config()

const PINATA_API_KEY = process.env.PINATA_API_KEY

const insertImage = async () => {
    //pin fall image
       try {
       let data = new FormData()
       data = req.body.data
       //data.append('file', fs.createReadStream('./assets/Pinnie.png'))
       data.append('pinataOptions', '{"cidVersion": 0}')
       data.append('pinataMetadata', '{"name": "fall img"}')
   
       const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
         headers: {
           'Authorization': `Bearer ${process.env.PINATA_API_KEY}`
         }
       })
       console.log(res.data)
       imageHash = res.data.IpfsHash
       //console.log(`View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`)
     } catch (error) {
       console.log(error)
     } 
    }

insertImage()
export default insertImage