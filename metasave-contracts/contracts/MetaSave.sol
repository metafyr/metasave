// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MetaSave {
	mapping(uint256 => string) public userIPFSMapping;

    function setIPFSFileName(uint256 user_id, string memory ipfsFileName) public {
        userIPFSMapping[user_id] = ipfsFileName;
    }

    function getIPFSFileName(uint256 user_id) public view returns (string memory) {
        require(userExists(user_id), "User not found");
        return userIPFSMapping[user_id];
    }

    function userExists(uint256 user_id) internal view returns (bool) {
        return bytes(userIPFSMapping[user_id]).length > 0;
    }
}
