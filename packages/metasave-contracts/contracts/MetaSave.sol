// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MetaSave {
    struct FallData {
        string imgIPFSid;
        string dataIPFSid;
    }

	mapping(address => string) private userIPFSMapping;
	mapping(address => FallData[]) private fallDataMap;

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

    function setFallData(address user_addr, string memory imgIPFSid, string memory dataIPFSid) public {
        FallData memory newFallData = FallData(imgIPFSid, dataIPFSid);
        fallDataMap[user_addr].push(newFallData);
    }

    function getFallData(address user_addr) public view returns (FallData[] memory) {
        FallData[] storage fallData = fallDataMap[user_addr];
        require(fallData.length > 0, "No fall data found for the given user address");
        return fallData;
    }
}
