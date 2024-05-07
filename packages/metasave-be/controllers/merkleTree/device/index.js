import { userOperation } from "../../../helpers/userOperation.js";
import { addresses } from "../../../constants/addresses.js";
import { abi } from "../../../abi/index.js";
import dotenv from 'dotenv'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import insertMT from "../../../helpers/merkleTree/insertMT.js";
import fetchMT from "../../../helpers/merkleTree/fetchMT.js";
import fs from 'fs'
import keccak256 from "keccak256";

dotenv.config()

const ADMIN_PRIV_KEY = process.env.ADMIN_PRIV_KEY;

const deviceMerkleTree = async (req, res) => {
    try {
        const deviceId = `0x${keccak256(req.body.deviceId).toString('hex')}`
        const CFAddress = req.body.CFAddress
        let treeCID = req.body.treeCID, treeJSON = {}

        let present = false, proof = '', root = ''

        const value = [CFAddress, deviceId]
        const values = [
            value
        ];

        console.log(values)

        if(treeCID == null || treeCID == undefined || treeCID == '' || treeCID == 'undefined' || treeCID == 'null'){
            // const values = [["0x1111111111111111111111111111111111111111", "0x066ac8fc073612bd0ab02b22c917837f97057aec7fdae5f7cc7694e2ba0edd25"]];
            console.log('Initializing new Tree')
            const tree = StandardMerkleTree.of(values, ["address", "bytes32"]);
            proof = tree.getProof(0)
            
            treeCID = await insertMT(tree.dump())

            console.log(treeCID, CFAddress)

            treeJSON = tree.dump()

            try{
                console.log('Setting root and IPFS CID')
                await userOperation(abi.ZKProof, 'setRootAndIPFS', [tree.root, treeCID, 0], addresses.ZKProof, ADMIN_PRIV_KEY)
            }catch(err){
                console.log('Error while setting root and IPFS CID')
            }
            
            console.log('Root and IPFS CID set successfully!')
            
            present = false
            
        }else{
            console.log('Checking Merkle Tree...', treeCID)
            treeJSON = await fetchMT(treeCID)
            
            let tree = StandardMerkleTree.load(treeJSON);
            
            await userOperation(abi.ZKProof, 'setRootAndIPFS', [tree.root, treeCID, 0], addresses.ZKProof, ADMIN_PRIV_KEY)
            
            for (const [i, v] of tree.entries()) {
                if (v[0] === values[0][0]) {
                    console.log(v[0], values[0][0])
                    present = true
                    proof = tree.getProof(i);
                    console.log(proof)
                    root = tree.root
                    break
                }
            }

            if(present == false){

                for (const [i, v] of tree.entries()){
                    values.push(v)
                }
                
                tree = StandardMerkleTree.of(values, ["address", "bytes32"]);

                proof = tree.getProof(0)

                treeCID = await insertMT(tree.dump())

                try{
                    console.log('Setting root and IPFS CID')
                    await userOperation(abi.ZKProof, 'setRootAndIPFS', [tree.root, treeCID, 0], addresses.ZKProof, ADMIN_PRIV_KEY)
                }catch(err){
                    console.log('Error while setting root and IPFS CID')
                }
    
                console.log('Root and IPFS CID set successfully!')

            }
        }

        res.status(200).json({
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

export default deviceMerkleTree