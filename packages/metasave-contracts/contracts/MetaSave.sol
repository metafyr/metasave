// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MetaSave is AccessControl {
    // constructor to grant admin access to the deployer
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    struct FallData {
        string imgIPFSid;
        string dataIPFSid;
    }

	mapping(address => string) private userIPFSMapping;
	mapping(address => FallData[]) private fallDataMap;

    mapping(address => address[]) private userHospitalMapping;
    mapping(address => address[]) private hospitalUserMapping;

    mapping(address => address[]) private userDeviceMapping;

    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }
 
    function grantUserRole(address account) public onlyAdmin returns (bool) { 
        grantRole(USER_ROLE, account);
        return true;
    }

    function grantHospitalRole(address account) public onlyAdmin returns (bool) { 
        grantRole(HOSPITAL_ROLE, account);
        return true;
    }

    function addDevice(address user_addr, address device_addr) public {
        require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

        userDeviceMapping[user_addr].push(device_addr);
    }

    function getDevices(address user_addr) public view returns (address[] memory) {
        require(hasRole(USER_ROLE, msg.sender));

        return userDeviceMapping[user_addr];
    }

    function userSelectHospital(address user_addr, address hospital_addr) public {
        require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

        userHospitalMapping[user_addr].push(hospital_addr);
        hospitalUserMapping[hospital_addr].push(user_addr);
    }

    function getUserHospitals(address user_addr) public view returns (address[] memory) {
        require(hasRole(USER_ROLE, msg.sender));

        return userHospitalMapping[user_addr];
    }

    function getHospitalUsers(address hospital_addr) public view returns (address[] memory) {
        require(hasRole(HOSPITAL_ROLE, msg.sender));

        return hospitalUserMapping[hospital_addr];
    }

    function setIPFSFileName(address user_addr, string memory ipfsFileName) public {
        require(hasRole(USER_ROLE, msg.sender));

        userIPFSMapping[user_addr] = ipfsFileName;
    }

    function getIPFSFileName(address user_addr) public view returns (string memory) {
        require(hasRole(USER_ROLE, msg.sender));

        require(userExists(user_addr), "User not found");

        return userIPFSMapping[user_addr];
    }

    function userExists(address user_addr) internal view returns (bool) {
        return bytes(userIPFSMapping[user_addr]).length > 0;
    }

    function setFallData(address user_addr, string memory imgIPFSid, string memory dataIPFSid) public {
        require(hasRole(USER_ROLE, msg.sender));

        FallData memory newFallData = FallData(imgIPFSid, dataIPFSid);
        fallDataMap[user_addr].push(newFallData);
    }

    function getFallData(address user_addr) public view returns (FallData[] memory) {
        require(hasRole(USER_ROLE, msg.sender));
        
        FallData[] storage fallData = fallDataMap[user_addr];
        require(fallData.length > 0, "No fall data found for the given user address");
        return fallData;
    }
}
