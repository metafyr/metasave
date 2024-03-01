import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY

async function fetchMT(CID){
    try {
        const response = await axios.get(`${PINATA_BASE_URL}/ipfs/${CID}`, {
            headers: {
                'x-pinata-gateway-token': PINATA_API_KEY
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export default fetchMT