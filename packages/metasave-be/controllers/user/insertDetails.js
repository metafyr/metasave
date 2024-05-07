import axios from 'axios'
import { FormData } from "formdata-node"
import dotenv from 'dotenv'

dotenv.config()

const PINATA_API_KEY = process.env.PINATA_API_KEY

const insertDetails = async(req, res) => {
    try{
        const formData = new FormData()
        const data = req.body.data
        const pinataMetadata = JSON.stringify(data)
        
        const jsonFile = new Blob([pinataMetadata], { type: 'application/json' })
        formData.set('file', jsonFile)

        formData.set('pinataMetadata', pinataMetadata);
    
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        })
        formData.set('pinataOptions', pinataOptions);

        try{
            console.log('Uploading to IPFS')
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'Authorization': `Bearer ${PINATA_API_KEY}`
                }
            });
            console.log('Successfully uploaded to IPFS!')
            res.json({CID: response.data.IpfsHash})
        } catch (error) {
            console.log(error);
        }
    }catch(err){
        console.log(err)
    }
}

export default insertDetails