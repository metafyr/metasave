import { j } from './insertDetails.js'
import CID from 'cids'
import { hashMap } from './insertDetails.js'

const fetchDetails = async(req, res) => {
    try {
        const cf = req.body.CF
        const cid = hashMap.get(cf)
        const data = await j.get(cid)
        console.log(data)
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}

export default fetchDetails