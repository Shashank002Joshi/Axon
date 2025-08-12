//spdx-License-Identifier: MIT
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
pragma solidity ^0.8.0;


contract AxonTimelock is ReentrancyGuard{
    struct TimelockEntry {
        address bounty;
        uint256 releaseTime;
        uint256 amount;
        address beneficiary;
        bool executed;
        bool disputed;
        string disputeReason;
    }
    
    mapping(bytes32 => TimelockEntry) public timelocks;
    mapping(address => bytes32[]) public bountyTimelocks;
    
    uint256 public constant DEFAULT_TIMELOCK = 7 days;
    uint256 public constant DISPUTE_WINDOW = 3 days;
    
    event TimelockCreated(
        bytes32 indexed timelockId,
        address indexed bounty,
        address indexed beneficiary,
        uint256 amount,
        uint256 releaseTime
    );
    event TimelockExecuted(bytes32 indexed timelockId, address indexed beneficiary, uint256 amount);
    event DisputeRaised(bytes32 indexed timelockId, string reason);
    event DisputeResolved(bytes32 indexed timelockId, bool approved);
    
    function createTimelock(
        address bounty,
        address beneficiary,
        uint256 amount,
        uint256 customDelay
    ) external payable returns (bytes32 timelockId) {
        require(msg.value == amount, "Incorrect amount sent");
        require(beneficiary != address(0), "Invalid beneficiary");
        
        uint256 delay = customDelay > 0 ? customDelay : DEFAULT_TIMELOCK;
        timelockId = keccak256(abi.encodePacked(bounty, beneficiary, amount, block.timestamp));
        
        timelocks[timelockId] = TimelockEntry({
            bounty: bounty,
            releaseTime: block.timestamp + delay,
            amount: amount,
            beneficiary: beneficiary,
            executed: false,
            disputed: false,
            disputeReason: ""
        });
        
        bountyTimelocks[bounty].push(timelockId);
        
        emit TimelockCreated(timelockId, bounty, beneficiary, amount, block.timestamp + delay);
    }
    
    function executeTimelock(bytes32 timelockId) external nonReentrant {
        TimelockEntry storage entry = timelocks[timelockId];
        require(!entry.executed, "Already executed");
        require(!entry.disputed, "Under dispute");
        require(block.timestamp >= entry.releaseTime, "Timelock not expired");
        require(
            msg.sender == entry.beneficiary,
            "Not authorized"
        );
        
        entry.executed = true;
        payable(entry.beneficiary).transfer(entry.amount);
        
        emit TimelockExecuted(timelockId, entry.beneficiary, entry.amount);
    }
    
    function raiseDispute(bytes32 timelockId, string calldata reason) external {
        TimelockEntry storage entry = timelocks[timelockId];
        require(!entry.executed, "Already executed");
        require(!entry.disputed, "Already disputed");
        require(
            block.timestamp <= entry.releaseTime + DISPUTE_WINDOW,
            "Dispute window closed"
        );
        
        entry.disputed = true;
        entry.disputeReason = reason;
        
        emit DisputeRaised(timelockId, reason);
    }
    
    function resolveDispute(bytes32 timelockId, bool approved) external{
        TimelockEntry storage entry = timelocks[timelockId];
        require(entry.disputed, "No dispute to resolve");
        require(!entry.executed, "Already executed");
        
        if (approved) {
            entry.disputed = false; // Allow execution
        } else {
            entry.executed = true; // Mark as executed to prevent future execution
            // Funds stay locked or returned to bounty contract
        }
        
        emit DisputeResolved(timelockId, approved);
    }
    
    function getTimelockDetails(bytes32 timelockId)
        external
        view
        returns (
            address bounty,
            uint256 releaseTime,
            uint256 amount,
            address beneficiary,
            bool executed,
            bool disputed,
            string memory disputeReason
        )
    {
        TimelockEntry storage entry = timelocks[timelockId];
        return (
            entry.bounty,
            entry.releaseTime,
            entry.amount,
            entry.beneficiary,
            entry.executed,
            entry.disputed,
            entry.disputeReason
        );
    }
    
    function getBountyTimelocks(address bounty) external view returns (bytes32[] memory) {
        return bountyTimelocks[bounty];
    }
}