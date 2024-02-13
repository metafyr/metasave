import { createHelia } from 'helia'
import { json } from '@helia/json'

const helia = await createHelia()
export const j = json(helia)

const insertDetails = async(req, res) => {
    try{
        const data = req.body.data 
        const myImmutableAddress = await j.add(data)
        console.log(myImmutableAddress)
        console.log(await j.get(myImmutableAddress))
        res.json({CID: myImmutableAddress.toString()})
    }catch(err){
        console.log(err)
    }
}

export default insertDetails