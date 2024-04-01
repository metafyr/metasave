// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MetaSave is AccessControl {
    address private admin = 0xcE927753f89b4482CbD56afFEe3bf2931418e471;
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    struct FallData {
        string imgIPFSid;
        string dataIPFSid;
    }

    struct Device {
        string name;
        string id;
        string ip;
        string date;
    }

	mapping(address => string) private userIPFSMapping;
	mapping(address => FallData[]) private fallDataMap;

    mapping(address => address[]) private userHospitalMapping;
    mapping(address => address[]) private hospitalUserMapping;

    mapping(address => Device[]) private userDeviceMapping;

    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }
 
    function grantUserRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) { 
        grantRole(USER_ROLE, account);
        return true;
    }

    function grantHospitalRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) { 
        grantRole(HOSPITAL_ROLE, account);
        return true;
    }

    function addDevice(address user_addr, string memory name, string memory id, string memory ip, string memory date) public {
        require(hasRole(USER_ROLE, user_addr), "Caller is not a user");

        Device memory newDevice = Device({
            name: name,
            id: id,
            ip: ip,
            date: date
        });

        userDeviceMapping[user_addr].push(newDevice);
    }

    function getDevices(address user_addr) public view returns (Device[] memory) {
        require(hasRole(USER_ROLE, user_addr), "Caller is not a user");

        return userDeviceMapping[user_addr];
    }

    function removeDevice(address owner, string memory deviceId) external returns (bool) {
        require(hasRole(USER_ROLE, owner), "Caller is not a user");

        Device[] storage devices = userDeviceMapping[owner];
        for (uint256 i = 0; i < devices.length; i++) {
            if (keccak256(bytes(devices[i].id)) == keccak256(bytes(deviceId))) {
                devices[i] = devices[devices.length - 1];
                devices.pop();
                return true;
            }
        }
        return false;
    }

    function userSelectHospital(address user_addr, address hospital_addr) public {
        require(hasRole(USER_ROLE, user_addr), "Caller is not a user");

        userHospitalMapping[user_addr].push(hospital_addr);
        hospitalUserMapping[hospital_addr].push(user_addr);
    }

    function getUserHospitals(address user_addr) public view returns (address[] memory) {
        require(hasRole(USER_ROLE, user_addr));

        return userHospitalMapping[user_addr];
    }

    function getHospitalUsers(address hospital_addr) public view returns (address[] memory) {
        require(hasRole(HOSPITAL_ROLE, hospital_addr));

        return hospitalUserMapping[hospital_addr];
    }

    function setIPFSFileName(address user_addr, string memory ipfsFileName) public {
        require(hasRole(USER_ROLE, user_addr));

        userIPFSMapping[user_addr] = ipfsFileName;
    }

    function getIPFSFileName(address user_addr) public view returns (string memory) {
        require(hasRole(USER_ROLE, user_addr));

        require(userExists(user_addr), "User not found");

        return userIPFSMapping[user_addr];
    }

    function userExists(address user_addr) internal view returns (bool) {
        return bytes(userIPFSMapping[user_addr]).length > 0;
    }

    function setFallData(address user_addr, string memory imgIPFSid, string memory dataIPFSid) public {
        require(hasRole(USER_ROLE, user_addr));

        FallData memory newFallData = FallData(imgIPFSid, dataIPFSid);
        fallDataMap[user_addr].push(newFallData);
    }

    function getFallData(address user_addr) public view returns (FallData[] memory) {
        require(hasRole(USER_ROLE, user_addr));
        
        FallData[] storage fallData = fallDataMap[user_addr];
        require(fallData.length > 0, "No fall data found for the given user address");
        return fallData;
    }
}
