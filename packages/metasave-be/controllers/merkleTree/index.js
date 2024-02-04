import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from 'fs'

const merkleTree = async(req, res) => {
    try {

        let present = false, proof = '', newUser = false, root = ''
        const value = [req.body.walletAddress, req.body.msg]
        const values = [
            value
        ];

        let tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("./controllers/merkleTree/tree.json", "utf8")));

        for (const [i, v] of tree.entries()) {
            if (v[0] === values[0][0]) {
                present = true
                proof = tree.getProof(i);
                root = tree.root
                break
            }
        }

        if(present == false){

            newUser = true

            for (const [i, v] of tree.entries()){
                values.push(v)
            }
    
            tree = StandardMerkleTree.of(values, ["address", "uint256"]);
            fs.writeFileSync("./controllers/merkleTree/tree.json", JSON.stringify(tree.dump()));
        }

        res.status(200).json({
            success: true,
            proof,
            newUser,
            root
        })

    } catch (error) {
        console.log(error)
    }
}

export default merkleTree