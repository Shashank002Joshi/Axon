//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./expertToken.sol";
import "./meritBondingCurve.sol";

pragma solidity ^0.8.0;


contract ExpertRegistry is IExpertRegistry{
    using Counters for Counters.Counter;
    Counters.Counter private _expertIds;
    
    struct ExpertInfo {
        address expert;
        address expertToken;
        string name;
        string domains;
        uint256 registrationTime;
        bool isActivated;
        uint256 activationEarnings;
        uint256 bountyWins;
        uint256 totalBounties;
        uint256 lastUpdate;
        uint256 reputation;
        uint256 repTier;
    }
    uint256[3] public reputationThresholds = [250, 500, 800];
    mapping(address => uint256) public expertToId;
    mapping(uint256 => ExpertInfo) public experts;
    mapping(address => bool) public isRegistered;
    
    address public reputationtoken;
    address public axonCore;
    
    // Activation thresholds
    uint256 public constant MIN_REPUTATION = 250;
    uint256 public constant MIN_CURATOR_CONVICTION = 10000;
    uint256 public constant MIN_ACTIVATION_EARNINGS = 2000; // Example threshold for activation earnings
    
    event ExpertRegistered(
        uint256 indexed expertId,
        address indexed expert,
        address indexed expertToken
    );
    event ExpertActivated(address indexed expert);
    
    modifier onlyAxonCore() {
        require(msg.sender == axonCore, "Only Axon Core");
        _;
    }
    
    constructor(address _reputationtoken) {
        reputationtoken = _reputationtoken;
    }
    
    function setAxonCore(address _axonCore) external {
        axonCore = _axonCore;
    }
    
    function registerExpert(
        string calldata name,
        string calldata domains,
        string calldata metadataURI
    ) external returns (uint256 expertId, address expertToken) {
        require(!isRegistered[msg.sender], "Already registered");
        require(bytes(name).length > 0, "Name required");
        require(bytes(domains).length > 0, "Domains required");
        


        
        _expertIds.increment();
        expertId = _expertIds.current();
       
        // Store expert info
        experts[expertId] = ExpertInfo({
            expert: msg.sender,
            expertToken: address(0),
            name: name,
            domains: domains,
            registrationTime: block.timestamp,
            isActivated: false,
            activationEarnings: 0,
             bountyWins: 0,
        totalBounties: 0,
        lastUpdate: 0,
        reputation:0,
        repTier: 0
        });
        
        expertToId[msg.sender] = expertId;
        isRegistered[msg.sender] = true;
        
        emit ExpertRegistered(expertId, msg.sender, expertToken);
    }
    function updateToken(address expert, string memory tokenSYM) external onlyAxonCore {
        uint256 expertId = expertToId[expert];
        require(expertId > 0, "Expert not registered");

        string memory tokenName = string(abi.encodePacked("Expert-"));
        string memory tokenSymbol = string(abi.encodePacked(tokenSYM));
        
        ExpertToken token = new ExpertToken(msg.sender, tokenName, tokenSymbol);
        experts[expertId].expertToken = address(token);
        
    }
    function checkActivationEligibility(address expert) 
        public
        view 
        returns (bool eligible, string memory reason) 
    {
        uint256 expertId = expertToId[expert];
        require(expertId > 0, "Expert not registered");
        
        ExpertInfo storage info = experts[expertId];
        if (info.isActivated) {
            return (false, "Already activated");
        }
        if (info.reputation < MIN_REPUTATION) {
            return (false, "Insufficient reputation score");
        }
        
        // Additional checks would go here for wins and curator conviction
        // For now, simplified to just reputation
        
        return (true, "Eligible for activation");
    }
    
    function activateExpert(address expert) external onlyAxonCore {
        uint256 expertId = expertToId[expert];
        require(expertId > 0, "Expert not registered");
        ExpertInfo storage info = experts[expertId];
        require(!info.isActivated, "Already activated");
        (bool eligible, string memory reason) = checkActivationEligibility(expert);
        require(eligible, reason);
        info.isActivated = true;
        emit ExpertActivated(expert);
    }
    
    function getExpertToken(address expert) external view returns (address) {
        uint256 expertId = expertToId[expert];
        return expertId > 0 ? experts[expertId].expertToken : address(0);
    }
    
    function isExpertActivated(address expert) external view returns (bool) {
        uint256 expertId = expertToId[expert];
        return expertId > 0 ? experts[expertId].isActivated : false;
    }
    function getExpertInfo(address expert) 
        external 
        view 
        returns (ExpertInfo memory) 
    {
        uint256 expertId = expertToId[expert];
        require(expertId > 0, "Expert not registered");
        return experts[expertId];
    }
    function updateExpertReputation(
        address expert,
        uint256 newReputation
    ) external onlyAxonCore {
        uint256 expertId = expertToId[expert];
        ExpertInfo storage info = experts[expertId];
        info.reputation += newReputation;
        if(info.reputation > reputationThresholds[info.repTier]) {
            info.repTier++;
            info.bountyWins++;
            info.lastUpdate = block.timestamp;
    
        }
        // Additional logic for updating reputation-related data can be added here, riht simple formula base decay and growth function but may be improved further
}
function updateBountyCount(address expert) external {
    uint256 expertId = expertToId[expert];
    ExpertInfo storage info = experts[expertId];
    info.totalBounties++;
    info.lastUpdate = block.timestamp;
}
}