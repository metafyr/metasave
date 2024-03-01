import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const PINATA_API_KEY = process.env.PINATA_API_KEY

async function insertMT(data){
    try{
        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            data,
            {
              headers: {
                Authorization: `Bearer ${PINATA_API_KEY}`,
              },
            }
          )
        const dataIPFSid = response.data.IpfsHash
        return dataIPFSid
    }catch(error){
        console.log(error)
    }
}

export default insertMT