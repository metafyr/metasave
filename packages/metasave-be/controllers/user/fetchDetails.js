import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY

const fetchDetails = async(req, res) => {
    try {
        // const ipfsId = "QmWcpT1SrrFGdKiovFcPs2NiYh2LvCxRNqZWJ8AY7CmGwr"
        const ipfsId = req.params.cid
        let data
        try{
            const response = await axios.get(`${PINATA_BASE_URL}/ipfs/${ipfsId}`, {
                headers: {
                    'x-pinata-gateway-token': PINATA_API_KEY
                }
            })
            data = response.data
        }catch(e){
            console.log(e)
        }
        res.json({data})
    } catch (error) {
        console.log(error)
    }
}

export default fetchDetails
