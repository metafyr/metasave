// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MetaSave {
	mapping(address => string) public userIPFSMapping;

    function setIPFSFileName(address user_addr, string memory ipfsFileName) public {
        userIPFSMapping[user_addr] = ipfsFileName;
    }

    function getIPFSFileName(address user_addr) public view returns (string memory) {
        require(userExists(user_addr), "User not found");
        return userIPFSMapping[user_addr];
    }

    function userExists(address user_addr) internal view returns (bool) {
        return bytes(userIPFSMapping[user_addr]).length > 0;
    }
}
