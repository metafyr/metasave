import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from 'fs'

const initMT = async() => {
    try {

        let present = false, proof = '', newUser = false, root = ''
        // const value = [req.body.walletAddress, req.body.msg]
        const value = ["0x1111111111111111111111111111111111111111", "0x066ac8fc073612bd0ab02b22c917837f97057aec7fdae5f7cc7694e2ba0edd25"]
        const values = [
            value
        ];

        // let tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("./controllers/merkleTree/tree.json", "utf8")));

        // for (const [i, v] of tree.entries()) {
        //     if (v[0] === values[0][0]) {
        //         present = true
        //         proof = tree.getProof(i);
        //         root = tree.root
        //         break
        //     }
        // }

        if(present == false){

            newUser = true

            // for (const [i, v] of tree.entries()){
            //     values.push(v)
            // }
    
            const tree = StandardMerkleTree.of(values, ["address", "bytes32"]);
            fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
        }

    } catch (error) {
        console.log(error)
    }
}

initMT()

export default initMT