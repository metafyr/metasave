import sendMessage from "../../helpers/whatsapp/sendMessage.js"
import { createHelia } from 'helia'
import { dagJson } from '@helia/dag-json'
import { strings } from '@helia/strings'
import CID from 'cids'
import multihashing from 'multihashing-async'

const helia = await createHelia()
const d = dagJson(helia)
const s = strings(helia)

const whatsappNotification = async(req, res) => {
    try {
        const hash = 'baguqeeracmxas7kkrjpestxdqihmqwklvm73vi53e6hudx2hvniwagubxp5q'
        // const hash = req.body.hash


        //fetch userDetails from IPFS
        const fileCID = new CID(hash)
        console.log(fileCID)
        const data = await s.get(fileCID)
        console.log(data)


        //loop through phone numbers and send message
        //  for (let i = 0; i < data.contacts.length; i++) {
        //      const res = sendMessage(data.contacts[i])
        //      if(!res){
        //          console.log('Error sending message to', data.contacts[i])
        //      }
        //  }
    } catch (error) {
        console.log(error)
    }
}

export default whatsappNotification