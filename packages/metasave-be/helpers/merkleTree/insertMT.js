import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const PINATA_API_KEY = process.env.PINATA_API_KEY

const insertMT = async(data) => {
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
        return response.data.IpfsHash
    }catch(error){
        console.log(error)
    }
}

export default insertMT