pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ZKProof {
    bytes32 private root;

    constructor(bytes32 _root) {
        root = _root;
    }

    function verify(
        bytes32[] memory proof,
        address addr,
        uint256 message
    ) public {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(addr, message))));
        require(MerkleProof.verify(proof, root, leaf), "Invalid proof");
    }
}