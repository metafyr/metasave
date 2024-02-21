import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY

const fetchDetails = async() => {
    try {
        const cf = req.body.CF
        try{
            const response = await axios.get(`${PINATA_BASE_URL}/ipfs/${cf}`, {
                headers: {
                    'x-pinata-gateway-token': PINATA_API_KEY
                }
            })
            console.log(response.data)
            imagedata = response.data
            const base64Image = Buffer.from(imageData).toString('base64')
        }catch(e){
            console.log(e)
        }
        //res.json(data)
        console.log("image retrieved successfully")
    } catch (error) {
        console.log(error)
    }
}

export default fetchDetails
