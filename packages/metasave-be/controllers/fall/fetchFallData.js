import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY

const fetchFallData = async(req, res) => {
    try {
        let dataIPFSdata = ''

        const dataIPFSid = req.query.dataIPFSid
        if(dataIPFSid.length > 0){
            try{
                const response1 = await axios.get(`${PINATA_BASE_URL}/ipfs/${dataIPFSid}`, {
                    headers: {
                        'x-pinata-gateway-token': PINATA_API_KEY
                    }
                })
                //const key = Object.keys(response1.data)[0];
                const innerJsonString = JSON.stringify(response1.data)
                //console.log(innerJsonString)
                const innerJsonObject = JSON.parse(innerJsonString);                
                dataIPFSdata = innerJsonObject
            }catch(e){
                console.log(e)
            }
        }
        res.json({dataIPFSdata})
    } catch (error) {
        console.log(error)
    }
}

export default fetchFallData