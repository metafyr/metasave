import { userOperation } from "../../../helpers/userOperation.js";
import { addresses } from "../../../constants/addresses.js";
import { abi } from "../../../abi/index.js";
import dotenv from 'dotenv'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import insertMT from "../../../helpers/merkleTree/insertMT.js";
import fetchMT from "../../../helpers/merkleTree/fetchMT.js";

dotenv.config()

const ADMIN_PRIV_KEY = process.env.ADMIN_PRIV_KEY;

const userMerkleTree = async (req, res) => {
    try {
        let present = false, proof = '', newUser = false, root = ''
        const walletAddress = req.body.walletAddress
        const CFAddress = req.body.CFAddress
        const msg = `0x${req.body.msg}`
        const value = [walletAddress, msg]
        let treeCID = req.body.treeCID, treeJSON = {}
        const values = [
            value
        ];

        if(treeCID == null || treeCID == undefined || treeCID == '' || treeCID == 'undefined' || treeCID == 'null'){
            // const values = [["0x1111111111111111111111111111111111111111", "0x066ac8fc073612bd0ab02b22c917837f97057aec7fdae5f7cc7694e2ba0edd25"]];
            console.log('Initializing new Tree')
            const tree = StandardMerkleTree.of(values, ["address", "bytes32"]);
            console.log(tree.dump())
            
            treeCID = await insertMT(tree.dump())

            console.log(treeCID, CFAddress)

            treeJSON = tree.dump()

            try{
                console.log('Granting USER role to new user')
                await userOperation(abi.MetaSave, 'grantUserRole', [CFAddress], addresses.MetaSave, ADMIN_PRIV_KEY)
            }catch(err){
                console.log(`Error while granting USER role to ${CFAddress}`)
            }

            console.log('USER role granted successfully!')

            try{
                console.log('Setting root and IPFS CID')
                await userOperation(abi.ZKProof, 'setRootAndIPFS', [tree.root, treeCID, 1], addresses.ZKProof, ADMIN_PRIV_KEY)
            }catch(err){
                console.log(`Error while setting root and IPFS CID`)
            }

            present = false
            newUser = true
            
        }else{
            console.log('Checking Merkle Tree...')
            treeJSON = await fetchMT(treeCID)

            console.log(treeJSON)

            let tree = StandardMerkleTree.load(treeJSON);
        
            for (const [i, v] of tree.entries()) {
                if (v[0] === values[0][0]) {
                    present = true
                    proof = tree.getProof(i)
                    console.log(proof)
                    root = tree.root
                    break
                }
            }

            if(present == false){
                console.log('New user detected!')
                newUser = true

                for (const [i, v] of tree.entries()){
                    values.push(v)
                }
                
                tree = StandardMerkleTree.of(values, ["address", "bytes32"]);

                treeCID = await insertMT(tree.dump())

                try{
                    console.log('Granting USER role to new user')
                    await userOperation(abi.MetaSave, 'grantUserRole', [CFAddress], addresses.MetaSave, ADMIN_PRIV_KEY)
                }catch(err){
                    console.log(`Error while granting USER role to ${CFAddress}`)
                }

                console.log('USER role granted successfully!')

                try{
                    console.log('Setting root and IPFS CID')
                    await userOperation(abi.ZKProof, 'setRootAndIPFS', [tree.root, treeCID, 1], addresses.ZKProof, ADMIN_PRIV_KEY)
                }catch(err){
                    console.log(`Error while setting root and IPFS CID`)
                }

                console.log('Root and IPFS CID set successfully!')
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

export default userMerkleTree