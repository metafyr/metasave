import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { dagJson } from '@helia/dag-json'
import { promises as fsPromises } from 'fs';
import { userOperation } from '../../helpers/userOperation';
import { abi } from '../../abi/index.js';

const helia = await createHelia()
const fs = unixfs(helia)
const d = dagJson(helia)

const fall = async (req, res) => {
  try {


    const PRIV_KEY = req.body.PRIV_KEY

    // IPFS part
    console.log(req.body)
    const predictionData = JSON.parse(req.body.prediction_data)
    const privKey = req.body.PRIV_KEY
    const username = req.body.username

    const imagePath = `uploads/${username}/image.jpg`;
    const imageBuffer = await fsPromises.readFile(imagePath);
    const imageUint8Array = new Uint8Array(imageBuffer);
    const imgIPFSid = await fs.addBytes(imageUint8Array);
    
    const AddObject = await d.add(predictionData)
    const data2 = { link: AddObject }
    const AddObject2 = await d.add(data2)
    const retrievedObject = await d.get(AddObject2)
    const dataIPFSid = retrievedObject.link.toString()
    console.log({ImgIPFSID: imgIPFSid.toString(), DataIPFSID: dataIPFSid});


    // Blockchain part 
    functionName = "setFallData";
    args = [CFAddress, imgIPFSid.toString(), dataIPFSid];
    
    const txHash = await userOperation(abi.MetaSave, functionName, args, PRIV_KEY);
    res.send({ imgIPFSid: imgIPFSid.toString(), dataIPFSid, txHash })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export default fall
