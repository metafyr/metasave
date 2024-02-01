import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from 'fs'

const merkleTree = async(req, res) => {
    try {

        let present = false, proof = '', newUser = false

        const values = [
            JSON.parse(req.body.value)
        ];

        let tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("./controllers/merkleTree/tree.json", "utf8")));

        for (const [i, v] of tree.entries()) {
            if (v[0] === values[0][0]) {
                console.log(v[0], values[0][0])
                present = true
                proof = tree.getProof(i);
                console.log(proof)
                break
            }
        }

        if(present == false){

            newUser = true

            for (const [i, v] of tree.entries()){
                values.push(v)
            }

            console.log(values)
    
            tree = StandardMerkleTree.of(values, ["address", "uint256"]);
            console.log(tree.root)
            fs.writeFileSync("./controllers/merkleTree/tree.json", JSON.stringify(tree.dump()));
        }

        res.status(200).json({
            success: true,
            proof,
            newUser
        })

    } catch (error) {
        console.log(error)
    }
}

export default merkleTree