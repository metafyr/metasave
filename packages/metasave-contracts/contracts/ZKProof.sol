// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ZKProof {

    bytes32 private u_root;
    string private u_mtIPFSid;

    bytes32 private d_root;
    string private d_mtIPFSid;

    function setRootAndIPFS(bytes32 _root, string memory _mtIPFSid, uint32 user) public {
        if (user == 1){
            u_root = _root;
            u_mtIPFSid = _mtIPFSid;
        }else if (user == 0){
            d_root = _root;
            d_mtIPFSid = _mtIPFSid;
        }
    }

    function getMTRoot(uint32 user) public view returns (bytes32) {
        if(user == 1){
            return u_root;
        }else if(user == 0){
            return d_root;
        }
    }

    function getMTIPFSid(uint32 user) public view returns (string memory) {
        if(user == 1){
            return u_mtIPFSid;
        }else if(user == 0){
            return d_mtIPFSid;
        }
    }

    function verify(
        bytes32[] memory proof,
        address hxsh,
        bytes32 message,
        uint32 user
    ) public view returns (bool) {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(hxsh, message))));
        // another verify circuit to verify if the user holds the token/message
        if(user == 1){
            return MerkleProof.verify(proof, u_root, leaf);
        }else if(user == 0){
            return MerkleProof.verify(proof, d_root, leaf);
        }
    }
}