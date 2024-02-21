
import { promises as fsPromises } from 'fs';
import { userOperation } from '../../helpers/userOperation.js';
import { abi } from '../../abi/index.js';
import { FormData } from "formdata-node"


const insertFall = async (req, res) => {
  try {
    let dataIPFSid, imgIPFSid

    const formData = new FormData()

    const PRIV_KEY = req.body.PRIV_KEY

    // IPFS part
    console.log(req.body)
    const predictionData = JSON.parse(req.body.prediction_data)
    const pinataMetadata = JSON.stringify(predictionData)
    const jsonFile = new Blob([pinataMetadata], { type: 'application/json' })
    formData.set('file', jsonFile)
    formData.set('pinataMetadata', pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.set('pinataOptions', pinataOptions);
    try{
      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'Authorization': `Bearer ${PINATA_API_KEY}`
        }
      });
      dataIPFSid = response.data.IpfsHash
    } catch (error) {
        console.log(error);
    }
    const privKey = req.body.PRIV_KEY
    const username = req.body.username

    const imagePath = `uploads/${username}/image.jpg`;
    const imageBuffer = await fsPromises.readFile(imagePath)
    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.set('file', imageBlob);
    formData.set('pinataMetadata', '{"name": "fall img"}')
    formData.set('pinataOptions', '{"cidVersion": 0}')
    try {
      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'Authorization': `Bearer ${PINATA_API_KEY}`
        }
      });
      imgIPFSid = response.data.IpfsHash
    } catch (error) {
      console.log(error);
    }
    
    // Blockchain part 
    functionName = "setFallData";
    args = [CFAddress, imgIPFSid, dataIPFSid];
    
    const txHash = await userOperation(abi.MetaSave, functionName, args, PRIV_KEY);
    res.send({ imgIPFSid, dataIPFSid, txHash })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export default insertFall
