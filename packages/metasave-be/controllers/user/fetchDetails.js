import { j } from './insertDetails.js'
import CID from 'cids'

const fetchDetails = async(req, res) => {
    try {
        const cid = new CID('bagaaieragt4ev55rjvvs4ere6td357exmdzlwommiz254s5veibruc2nrg3q')
        const data = await j.get(cid)
        console.log(data)
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}

export default fetchDetails