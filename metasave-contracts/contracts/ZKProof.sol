// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ZKProof {

    function verify(
        bytes32 root,
        bytes32[] memory proof,
        address hxsh,
        uint256 message
    ) public view returns (bool) {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(hxsh, message))));
        return MerkleProof.verify(proof, root, leaf);
    }

}