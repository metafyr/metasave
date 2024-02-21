
import { promises as fsPromises } from 'fs';
import { userOperation } from '../../helpers/userOperation.js';
import { abi } from '../../abi/index.js';
import { FormData } from "formdata-node"
import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'

dotenv.config()

const PINATA_API_KEY = process.env.PINATA_API_KEY

const insertFall = async (req, res) => {
  try {
    let dataIPFSid, imgIPFSid

    const formData = new FormData()

    const PRIV_KEY = req.body.PRIV_KEY

    // IPFS part
    const predictionData = JSON.parse(req.body.prediction_data)
    // const predictionData = {
    //   fall: true,
    //   probability: 0.8,
    //   name: "abhinav"
    // }
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

    const username = req.body.username

    const imagePath = `uploads/${username}/image.jpg`;

    const file = fs.createReadStream(imagePath)
    formData.set('file', file);
    const pinataMetadata2 = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", pinataMetadata2);

    formData.append("pinataOptions", pinataOptions);
    try {
      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
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
    // res.status(500).send({ error: err.message })
  }
}

export default insertFall
