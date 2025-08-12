// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./expertToken.sol";
import "./expertRegistry.sol";
import "./reputationToken.sol";
import "./bountyfac.sol";
import "./meritBondingCurve.sol";
contract AxonCore is Ownable, ReentrancyGuard {
    address public bountyFactory;
    address public expertRegistry;
    address public reputationNFT;
    address public liquidityPool;
    address public protocolTreasury;
    
    uint256 public protocolFeePercentage = 10; // 10%
    uint256 public totalProtocolRevenue;
    
    struct BountyMetrics {
        uint256 totalBounties;
        uint256 totalValue;
        uint256 avgCompletionTime;
        mapping(string => uint256) domainCounts;
    }
    
    BountyMetrics public metrics;
    
    event ProtocolFeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);
    event BountyCompleted(
        address indexed bounty,
        address indexed winner,
        uint256 bountyValue,
        uint256 protocolFee
    );
    event ExpertTokenPurchase(
        address indexed expertToken,
        uint256 amount,
        address indexed expert
    );
    
    constructor(
        address _bountyFactory,
        address _expertRegistry,
        address _reputationNFT,
        address _liquidityPool,
        address _protocolTreasury
    ) {
        bountyFactory = _bountyFactory;
        expertRegistry = _expertRegistry;
        reputationNFT = _reputationNFT;
        liquidityPool = _liquidityPool;
        protocolTreasury = _protocolTreasury;
    }
    
    function setProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= 20, "Fee too high"); // Max 20%
        protocolFeePercentage = newFee;
        emit ProtocolFeeUpdated(newFee);
    }
    
    function setProtocolTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        protocolTreasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }
    
    function completeBounty(
        address bountyAddress,
        address winner,
        uint256 bountyValue
    ) external {
        require(msg.sender == bountyAddress, "Only bounty contracts");
        
        // Update metrics
        metrics.totalBounties++;
        metrics.totalValue += bountyValue;
        totalProtocolRevenue += protocolFee;
        
        // Get winner's expert token
        address expertToken = ExpertRegistry(expertRegistry).getExpertToken(winner);
        
        if (expertToken != address(0) && ExpertRegistry(expertRegistry).isExpertActivated(winner)) {
            // Use protocol fee to buy expert tokens, creating price pressure
            _buyExpertTokens(expertToken, protocolFee);
        } else {
            // If expert not activated, send fee to treasury
            payable(protocolTreasury).transfer(protocolFee);
        }
        
        emit BountyCompleted(bountyAddress, winner, bountyValue, protocolFee);
    }
    
    function _buyExpertTokens(address expertToken, uint256 amount) private {
        try ExpertTokenLiquidityPool(liquidityPool).buyTokens{value: amount}(expertToken) {
            emit ExpertTokenPurchase(expertToken, amount, ExpertToken(expertToken).expert());
        } catch {
            // If buying fails (no liquidity), send to treasury
            payable(protocolTreasury).transfer(amount);
        }
    }
    
    function updateExpertReputation(
        address expert,
        uint256 newScore,
        bool wonBounty,
        uint256 curatorStake
    ) external {
        // Only bounty contracts can update reputation
        require(BountyFactory(bountyFactory).bounties(1) != address(0), "Invalid caller");
        
        ReputationNFT(reputationNFT).updateReputation(expert, newScore, wonBounty, curatorStake);
        
        // Check if expert meets activation threshold
        (bool eligible,) = ExpertRegistry(expertRegistry).checkActivationEligibility(expert);
        if (eligible && !ExpertRegistry(expertRegistry).isExpertActivated(expert)) {
            ExpertRegistry(expertRegistry).activateExpert(expert);
        }
    }
    
    function getProtocolStats() 
        external 
        view 
        returns (
            uint256 totalBounties,
            uint256 totalValue,
            uint256 totalRevenue,
            uint256 avgBountyValue
        ) 
    {
        totalBounties = metrics.totalBounties;
        totalValue = metrics.totalValue;
        totalRevenue = totalProtocolRevenue;
        avgBountyValue = totalBounties > 0 ? totalValue / totalBounties : 0;
    }
    
    receive() external payable {
        // Accept ETH deposits to treasury
    }
    
    function withdrawTreasury(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(protocolTreasury).transfer(amount);
    }
}








