//SPDX-license-Identifier: MIT

import "./bounty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity ^0.8.0;

contract BountyFactory is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _bountyIds;
    
    address public axonCore;
    uint256 public minBountyAmount = 0.01 ether;
    uint256 public maxDeadlineDays = 365;
    
    mapping(uint256 => address) public bounties;
    mapping(address => uint256[]) public seekerBounties;
    mapping(address => uint256[]) public solverBounties;
    
    event BountyCreated(
        uint256 indexed bountyId,
        address indexed bounty,
        address indexed seeker,
        uint256 amount
    );
    
    modifier onlyAxonCore() {
        require(msg.sender == axonCore, "Only Axon Core");
        _;
    }
    
    function setAxonCore(address _axonCore) external onlyOwner {
        axonCore = _axonCore;
    }
    
    function setMinBountyAmount(uint256 _minAmount) external onlyOwner {
        minBountyAmount = _minAmount;
    }
    
    function createBounty(
        string calldata question,
        uint256 deadline
    ) external payable returns (uint256 bountyId, address bountyAddress) {
        require(msg.value >= minBountyAmount, "Bounty amount too low");
        require(deadline > block.timestamp, "Invalid deadline");
        require(deadline <= block.timestamp + (maxDeadlineDays * 1 days), "Deadline too far");
        
        _bountyIds.increment();
        bountyId = _bountyIds.current();
        
        Bounty bounty = new Bounty{value: msg.value}(
            msg.sender,
            axonCore,
            question,
            msg.value,
            deadline
        );
        
        bountyAddress = address(bounty);
        bounties[bountyId] = bountyAddress;
        seekerBounties[msg.sender].push(bountyId);
        
        emit BountyCreated(bountyId, bountyAddress, msg.sender, msg.value);
    }
    
    function getBountyAddress(uint256 bountyId) external view returns (address) {
        return bounties[bountyId];
    }
    
    function getSeekerBounties(address seeker) external view returns (uint256[] memory) {
        return seekerBounties[seeker];
    }
    
    function getTotalBounties() external view returns (uint256) {
        return _bountyIds.current();
    }
}