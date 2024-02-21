import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY

const fetchFallData = async() => {
    try {
        const cf = req.body.CF
        try{
            const response = await axios.get(`${PINATA_BASE_URL}/ipfs/${cf}`, {
                headers: {
                    'x-pinata-gateway-token': PINATA_API_KEY
                }
            })
            console.log(response.data)
        }catch(e){
            console.log(e)
        }
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}

export default fetchFallData