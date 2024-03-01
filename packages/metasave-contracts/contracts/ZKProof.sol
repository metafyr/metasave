// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ZKProof {

    bytes32 private root;
    string private mtIPFSid;

    function setRootAndIPFS(bytes32 _root, string memory _mtIPFSid) public {
        root = _root;
        mtIPFSid = _mtIPFSid;
    }

    function getMTRoot() public view returns (bytes32) {
        return root;
    }

    function getMTIPFSid() public view returns (string memory) {
        return mtIPFSid;
    }

    function verify(
        bytes32 root,
        bytes32[] memory proof,
        address hxsh,
        bytes32 message
    ) public view returns (bool) {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(hxsh, message))));
        return MerkleProof.verify(proof, root, leaf);
    }

}