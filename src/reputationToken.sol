//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./axon.sol";

pragma solidity ^0.8.0;

contract ReputationNFT is ERC721, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    address public axonCore;
    
    struct ReputationData {
        address expert;
        
        string metadataURI;
    }
    
    mapping(address => uint256) public expertToTokenId;
    mapping(uint256 => ReputationData) public reputationData;
    
    event ReputationUpdated(address indexed expert, uint256 newScore);
    
    modifier onlyAxonCore() {
        require(msg.sender == axonCore, "Only Axon Core");
        _;
    }
    
    constructor() ERC721("Axon Reputation", "AXON-REP") {}
    
    function setAxonCore(address _axonCore) external onlyOwner {
        axonCore = _axonCore;
    }
    
    function mintReputation(address expert, string calldata metadataURI) 
        external 
        onlyAxonCore 
        returns (uint256) 
    {
        require(expertToTokenId[expert] == 0, "Expert already has reputation NFT");
        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _mint(expert, tokenId);
        expertToTokenId[expert] = tokenId;
        
        reputationData[tokenId] = ReputationData({
            expert: expert,
            score: 100, // Starting score
            bountyWins: 0,
            totalBounties: 0,
            avgCuratorStake: 0,
            lastUpdate: block.timestamp,
            metadataURI: metadataURI
        });
        
        return tokenId;
    }
    
    function updateReputation(
        address expert,
        uint256 newScore,
        bool wonBounty,
        uint256 curatorStake
    ) external onlyAxonCore {
        uint256 tokenId = expertToTokenId[expert];
        require(tokenId > 0, "Expert not registered");
        
        ReputationData storage data = reputationData[tokenId];
        data.score = newScore;
        data.totalBounties++;
        
        if (wonBounty) {
            data.bountyWins++;
        }
        
        // Update average curator stake
        data.avgCuratorStake = (data.avgCuratorStake * (data.totalBounties - 1) + curatorStake) / data.totalBounties;
        data.lastUpdate = block.timestamp;
        
        emit ReputationUpdated(expert, newScore);
    }
    
    function getReputation(address expert) external view returns (uint256) {
        uint256 tokenId = expertToTokenId[expert];
        return tokenId > 0 ? reputationData[tokenId].score : 0;
    }
}
