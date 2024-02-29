import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY

const fetchFall = async(req, res) => {
    try {
        let dataIPFSdata = '', imgIPFSdata = ""

        const dataIPFSid = req.query.dataIPFSid
        if(dataIPFSid.length > 0){
            try{
                const response1 = await axios.get(`${PINATA_BASE_URL}/ipfs/${dataIPFSid}`, {
                    headers: {
                        'x-pinata-gateway-token': PINATA_API_KEY
                    }
                })
                const key = Object.keys(response1.data)[0];
                const innerJsonObject = JSON.parse(key);
                dataIPFSdata = innerJsonObject
            }catch(e){
                console.log(e)
            }
        }

        // const imgIPFSid = req.query.imgIPFSid
        // try{
        //     const response2 = await axios.get(`${PINATA_BASE_URL}/ipfs/${imgIPFSid}`, {
        //         headers: {
        //             'x-pinata-gateway-token': PINATA_API_KEY
        //         }
        //     })
        //     imgIPFSdata = response2.data
        // }catch(e){
        //     console.log(e)
        // }
        res.json({dataIPFSdata, imgIPFSdata})
    } catch (error) {
        console.log(error)
    }
}

export default fetchFall