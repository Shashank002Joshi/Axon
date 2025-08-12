//SPDX-license-Identifier: MIT

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./axon.sol";
pragma solidity ^0.8.0;

contract Bounty is ReentrancyGuard, IBounty{
    using Counters for Counters.Counter;
    Counters.Counter private _answerIds;
    
    enum BountyState { ACTIVE, WINNER_SELECTED, APPEALED, RESOLVED, CANCELLED }
    enum AnswerState { SUBMITTED, WINNER, DISPUTED, VALIDATED }
    
    struct Answer {
        address solver;
        string ipfsHash;
        string metadataURI;
        uint256 totalStakes;
        uint256 submissionTime;
        AnswerState state;
        mapping(address => uint256) curatorStakes;
        address[] curators;
    }
    
    address public immutable factory;
    address public immutable seeker;
    address public immutable axonCore;
    
    string public question;
    uint256 public bountyAmount;
    uint256 public deadline;
    uint256 public appealDeadline;
    BountyState public state;
    
    uint256 public winningAnswerId;
    uint256 public appealBond;
    bool public appealActive;
    
    mapping(uint256 => Answer) public answers;
    uint256[] public answerIds;
    
    event AnswerSubmitted(uint256 indexed answerId, address indexed solver, string ipfsHash);
    event StakeAdded(uint256 indexed answerId, address indexed curator, uint256 amount);
    event WinnerSelected(uint256 indexed answerId, address indexed solver);
    event AppealTriggered(uint256 indexed answerId, address indexed appellant);
    event BountyResolved(uint256 indexed winningAnswerId, uint256 totalPayout);
    
    modifier onlySeeker() {
        require(msg.sender == seeker, "Only seeker");
        _;
    }
    
    modifier onlyActive() {
        require(state == BountyState.ACTIVE, "Bounty not active");
        require(block.timestamp <= deadline, "Deadline passed");
        _;
    }
    
    modifier onlyAxonCore() {
        require(msg.sender == axonCore, "Only Axon Core");
        _;
    }
    
    constructor(
        address _seeker,
        address _axonCore,
        string memory _question,
        uint256 _bountyAmount,
        uint256 _deadline
    ) payable {
        require(msg.value == _bountyAmount, "Incorrect bounty amount");
        require(_deadline > block.timestamp, "Invalid deadline");
        
        factory = msg.sender;
        seeker = _seeker;
        axonCore = _axonCore;
        question = _question;
        bountyAmount = _bountyAmount;
        deadline = _deadline;
        state = BountyState.ACTIVE;
        appealBond = _bountyAmount / 20; // 5% of bounty as appeal bond
    }
    
    function submitAnswer(
        string calldata ipfsHash, 
        string calldata metadataURI
    ) external onlyActive {
        _answerIds.increment();
        uint256 answerId = _answerIds.current();
        
        Answer storage answer = answers[answerId];
        answer.solver = msg.sender;
        answer.ipfsHash = ipfsHash;
        answer.metadataURI = metadataURI;
        answer.submissionTime = block.timestamp;
        answer.state = AnswerState.SUBMITTED;
        
        answerIds.push(answerId);
        
        emit AnswerSubmitted(answerId, msg.sender, ipfsHash);
    }
    
    function stakeOnAnswer(uint256 answerId, uint256 amount) external payable onlyActive {
        require(answerId > 0 && answerId <= _answerIds.current(), "Invalid answer ID");
        require(msg.value == amount && amount > 0, "Invalid stake amount");
        
        Answer storage answer = answers[answerId];
        require(answer.solver != address(0), "Answer does not exist");
        
        if (answer.curatorStakes[msg.sender] == 0) {
            answer.curators.push(msg.sender);
        }
        
        answer.curatorStakes[msg.sender] += amount;
        answer.totalStakes += amount;
        
        emit StakeAdded(answerId, msg.sender, amount);
    }
    
    function selectWinner(uint256 answerId) external onlySeeker onlyActive {
        require(answerId > 0 && answerId <= _answerIds.current(), "Invalid answer ID");
        require(block.timestamp > deadline, "Deadline not reached");
        
        Answer storage answer = answers[answerId];
        require(answer.solver != address(0), "Answer does not exist");
        
        winningAnswerId = answerId;
        answer.state = AnswerState.WINNER;
        state = BountyState.WINNER_SELECTED;
        appealDeadline = block.timestamp + 7 days; // 7-day appeal window
        
        emit WinnerSelected(answerId, answer.solver);
    }
    
    function triggerAppeal(uint256 answerId, string calldata reason) 
        external 
        payable 
        nonReentrant 
    {
        require(state == BountyState.WINNER_SELECTED, "No winner selected");
        require(block.timestamp <= appealDeadline, "Appeal deadline passed");
        require(msg.value == appealBond, "Incorrect appeal bond");
        require(!appealActive, "Appeal already active");
        
        appealActive = true;
        state = BountyState.APPEALED;
        
        emit AppealTriggered(answerId, msg.sender);
    }
    
    function resolveBounty() external onlyAxonCore nonReentrant {
        require(
            state == BountyState.WINNER_SELECTED || state == BountyState.APPEALED,
            "Invalid state for resolution"
        );
        
        if (state == BountyState.WINNER_SELECTED) {
            require(block.timestamp > appealDeadline, "Appeal window still active");
        }
        
        _distributeFunds();
        state = BountyState.RESOLVED;
        
        emit BountyResolved(winningAnswerId, bountyAmount);
    }
    
    function _distributeFunds() private {
        Answer storage winningAnswer = answers[winningAnswerId];
        
        uint256 solverReward = (bountyAmount * 60) / 100; // 60%
        uint256 curatorPool = (bountyAmount * 25) / 100;  // 25%
        uint256 protocolFee = (bountyAmount * 10) / 100;  // 10%
        uint256 seekerRebate = (bountyAmount * 5) / 100;  // 5%
        
        // Pay solver
        payable(winningAnswer.solver).transfer(solverReward);
        
        // Distribute curator rewards pro-rata
        if (winningAnswer.totalStakes > 0) {
            for (uint256 i = 0; i < winningAnswer.curators.length; i++) {
                address curator = winningAnswer.curators[i];
                uint256 curatorStake = winningAnswer.curatorStakes[curator];
                uint256 curatorReward = (curatorPool * curatorStake) / winningAnswer.totalStakes;
                
                payable(curator).transfer(curatorStake + curatorReward);
            }
        }
        
        // Pay protocol fee and seeker rebate
        payable(axonCore).transfer(protocolFee);
        payable(seeker).transfer(seekerRebate);
    }
    
    function getAnswerDetails(uint256 answerId) 
        external 
        view 
        returns (
            address solver,
            string memory ipfsHash,
            string memory metadataURI,
            uint256 totalStakes,
            uint256 submissionTime,
            AnswerState answerState
        ) 
    {
        Answer storage answer = answers[answerId];
        return (
            answer.solver,
            answer.ipfsHash,
            answer.metadataURI,
            answer.totalStakes,
            answer.submissionTime,
            answer.state
        );
    }
    
    function getCuratorStake(uint256 answerId, address curator) 
        external 
        view 
        returns (uint256) 
    {
        return answers[answerId].curatorStakes[curator];
    }
    
    function getBountyState() external view returns (BountyState) {
        return state;
    }
    
    function getAnswerCount() external view returns (uint256) {
        return _answerIds.current();
    }
}