import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import multer from 'multer'
import { dagJson } from '@helia/dag-json'

const helia = await createHelia()
const fs = unixfs(helia)
const d = dagJson(helia)

const fall = async (req, res) => {
  try {
    console.log(req.body)
    const predictionData = JSON.parse(req.body.prediction_data)
    const privKey = req.body.PRIV_KEY
    const username = req.body.username

    // const imgIPFSid = await fs.add(`uploads/${username}/image.jpg`)
    
    const AddObject = await d.add(predictionData)
    const data2 = { link: AddObject }
    const AddObject2 = await d.add(data2)
    const retrievedObject = await d.get(AddObject2)
    const dataIPFSid = retrievedObject.link.toString()
    console.log(dataIPFSid)
    res.send({ dataIPFSid })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

export default fall
