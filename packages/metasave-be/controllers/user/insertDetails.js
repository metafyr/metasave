import { createHelia } from 'helia'
import { json } from '@helia/json'

const helia = await createHelia()
const j = json(helia)

const insertDetails = async(req, res) => {
    try{
        console.log(req.body.data)
        const data = req.body.data 
        const myImmutableAddress = await j.add({ hello: 'world' })

        console.log(await j.get(myImmutableAddress))
    }catch(err){
        console.log(err)
    }
}

export default insertDetails