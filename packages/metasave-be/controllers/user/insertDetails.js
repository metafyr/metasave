import { createHelia } from 'helia'
import { json } from '@helia/json'

const helia = await createHelia()
export const j = json(helia)

export let hashMap = new Map()

const insertDetails = async(req, res) => {
    try{
        const data = req.body.data 
        const myImmutableAddress = await j.add(data)
        console.log(myImmutableAddress)
        console.log(await j.get(myImmutableAddress))
        hashMap.set(data.CF, myImmutableAddress)
        res.json({CID: myImmutableAddress.toString()})
    }catch(err){
        console.log(err)
    }
}

export default insertDetails