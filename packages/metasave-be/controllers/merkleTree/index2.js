import { userOperation } from "../../helpers/userOperation.js";
import { addresses } from "../../constants/addresses.js";
import { abi } from "../../abi/index.js";
import dotenv from 'dotenv'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import insertMT from "../../helpers/merkleTree/insertMT.js";
import fetchMT from "../../helpers/merkleTree/fetchMT.js";

dotenv.config()

const ADMIN_PRIV_KEY = process.env.ADMIN_PRIV_KEY;

const merkleTree = async (req, res) => {
    try {
        let present = false, proof = '', newUser = false, root = ''
        const walletAddress = req.body.walletAddress
        const msg = `0x${req.body.msg}`
        const value = [walletAddress, msg]
        let treeCID = req.body.treeCID, treeJSON = {}
        const values = [
            value
        ];

        if(treeCID == null || treeCID == undefined || treeCID == '' || treeCID == 'undefined' || treeCID == 'null'){
            console.log('here', treeCID)
            const values = [["0x1111111111111111111111111111111111111111", "0x066ac8fc073612bd0ab02b22c917837f97057aec7fdae5f7cc7694e2ba0edd25"]];
            const tree = StandardMerkleTree.of(values, ["address", "bytes32"]);
            console.log(tree.dump())
            
            treeCID = await insertMT(tree.dump())

            console.log(treeCID)

            treeJSON = tree.dump()

            await userOperation(abi.ZKProof, 'setRootAndIPFS', [tree.root, treeCID], addresses.ZKProof, ADMIN_PRIV_KEY)

            present = false
            newUser = true

        }else{
            console.log('nope', treeCID)
            treeJSON = await fetchMT(treeCID)
            console.log(treeJSON)

            let tree = StandardMerkleTree.load(treeJSON);
        
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
                
                tree = StandardMerkleTree.of(values, ["address", "bytes32"]);

                treeCID = await insertMT(tree.dump())

                await userOperation(abi.ZKProof, 'setRootAndIPFS', [tree.root, treeCID], addresses.ZKProof, ADMIN_PRIV_KEY)
            }
        }

        
        

        res.status(200).json({
            success: true,
            proof,
            newUser,
            root,
            msg
        })

    } catch (error) {
        console.log(error)
    }
}

export default merkleTree