//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./power.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IExpertToken {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount, address _owner) external;
    function totalSupply() external view returns (uint256);
    function expert() external view returns (address);
}
interface IExpertRegistry {
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
    function getExpertInfo(address expert) external view returns (ExpertInfo memory);
}



contract BancorBondingCurve is ReentrancyGuard, Power {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    
    struct ExpertReserves {
        uint256 xrpReserves;          // XRP backing the tokens
        uint256 circulatingSupply;    // Tokens in circulation
        uint256 protocolHoldings;     // Tokens held by protocol
        uint256 crrTier;              // Current CRR tier (1, 2, or 3)
        bool isActive;                // Whether bonding curve is active
    }
    
    mapping(address => ExpertReserves) public expertReserves;
    mapping(address => bool) public isExpertActive;
    
    address public axonCore;
    address public reputationNFT;
    address public expertregistry;
    uint32 private constant MAX_RESERVE_RATIO = 1000000; // 100%
    // CRR Tiers: Higher reputation = Lower CRR = More price sensitivity
    uint32[3] public crrValues = [600000, 450000, 200000]; //ppm
    
    
    event BondingCurveActivated(address indexed expert, uint256 initialReserves);
    event TokensPurchased(address indexed expert, address indexed buyer, uint256 xrpIn, uint256 tokensOut);
    event TokensSold(address indexed expert, address indexed seller, uint256 tokensIn, uint256 xrpOut);
    event ReservesAdded(address indexed expert, uint256 amount);
    event CRRTierUpdated(address indexed expert, uint256 oldTier, uint256 newTier);
    event ProtocolSoldOffCurve(address indexed expert, address indexed buyer, uint256 tokens, uint256 price);
    
    modifier onlyAxonCore() {
        require(msg.sender == axonCore, "Only Axon Core");
        _;
    }
    
    constructor(address _axonCore, address _reputationNFT, address _expertregistry ) {
        axonCore = _axonCore;
        reputationNFT = _reputationNFT;
        expertregistry = _expertregistry;
    }
    
    // Activate bonding curve for expert when they reach threshold
    function activateBondingCurve(address expert) external {
        require(!isExpertActive[expert], "Already active");
        
        IExpertRegistry.ExpertInfo memory info = IExpertRegistry(expertregistry).getExpertInfo(expert);
        expertReserves[expert] = ExpertReserves({
            xrpReserves: info.activationEarnings,
            circulatingSupply: 100000, // Expert's 20% allocation
            protocolHoldings: 0,
            crrTier: info.repTier,
            isActive: true
        });
        
        isExpertActive[expert] = true;
        
        emit BondingCurveActivated(expert, info.activationEarnings);
    }
    
    function buyTokens(address expert) external payable nonReentrant {
        require(isExpertActive[expert], "Expert not active");
        require(msg.value > 0, "Must send XRP");
        IExpertRegistry.ExpertInfo memory info = IExpertRegistry(expertregistry).getExpertInfo(expert);

        uint256 result;
        uint8 precision;
        ExpertReserves storage reserves = expertReserves[expert];
        uint256 baseN = reserves.xrpReserves.add(msg.value);
        (result, precision) = power(baseN, reserves.xrpReserves, crrValues[reserves.crrTier], MAX_RESERVE_RATIO);
        uint256 tokensOut = reserves.circulatingSupply.mul(result)>> precision;
        tokensOut = tokensOut.sub(reserves.circulatingSupply);


        
        // uint256 crr = crrValues[reserves.crrTier];
        
        // // Bancor buy formula: ΔS = S * ((1 + ΔR/R)^(1/CRR) - 1)
        // uint256 newReserves = reserves.xrpReserves + msg.value;
        // uint256 reserveRatio = (newReserves * 10**18) / reserves.xrpReserves;
        
        // // Simplified calculation for demonstration
        // tokensOut = (reserves.circulatingSupply * msg.value) / (reserves.xrpReserves * crr / 100);
        
        // require(tokensOut > 0, "Insufficient tokens out");
        // require(tokensOut <= _getAvailableTokens(expert), "Exceeds available supply");
        
        // Update reserves
        address expertToken = info.expertToken;
        IExpertToken(expertToken).mint(msg.sender, tokensOut);

        reserves.xrpReserves = baseN;
        reserves.circulatingSupply += tokensOut;
        
        emit TokensPurchased(expert, msg.sender, msg.value, tokensOut);
    }
    
    // Sell tokens back to bonding curve
    function sellTokens(address expert, uint256 tokenAmount) external nonReentrant{
        require(isExpertActive[expert], "Expert not active");
        require(tokenAmount > 0, "Must sell positive amount");
        
        ExpertReserves storage reserves = expertReserves[expert];
        uint32 crr = crrValues[reserves.crrTier];
        
        // Bancor sell formula: ΔR = R * (1 - (1 - ΔS/S)^CRR)
        IExpertRegistry.ExpertInfo memory info = IExpertRegistry(expertregistry).getExpertInfo(expert);

        uint256 result;
        uint8 precision; 
        uint256 baseD = reserves.circulatingSupply.sub(tokenAmount);
        (result, precision) = power(reserves.circulatingSupply, baseD, MAX_RESERVE_RATIO, crr);
        uint256 oB = reserves.xrpReserves.mul(result);
        uint256 oA = reserves.xrpReserves<<precision;
        uint256 xrpOut = oB.sub(oA).div(result);
        // xrpOut = (tokenAmount * reserves.xrpReserves * crr / 100) / reserves.circulatingSupply;
        
        // require(xrpOut > 0, "Insufficient XRP out");
        // require(xrpOut <= reserves.xrpReserves, "Insufficient reserves");
        
        // // Burn tokens from seller
        // address expertToken = _getExpertToken(expert);
        // IExpertToken(expertToken).transferFrom(msg.sender, address(this), tokenAmount);
        // IExpertToken(expertToken).burn(tokenAmount);
        address expertToken = info.expertToken;
        IExpertToken(expertToken).burn(tokenAmount, address(msg.sender));
        // Update reserves
        reserves.xrpReserves -= xrpOut;
        reserves.circulatingSupply -= tokenAmount;
        
        // Transfer XRP to seller
        payable(msg.sender).transfer(xrpOut);
        
        emit TokensSold(expert, msg.sender, tokenAmount, xrpOut);
    }
    
     function updateCRRTier(address expert) external onlyAxonCore {
        require(isExpertActive[expert], "Expert not active");
        
       // uint256 reputation = IReputationNFT(reputationNFT).getReputation(expert);
        IExpertRegistry.ExpertInfo memory info = IExpertRegistry(expertregistry).getExpertInfo(expert);

        uint256 newTier =info.repTier;
        uint256 oldTier = expertReserves[expert].crrTier;
        
        if (newTier != oldTier) {
            // CRITICAL: Adjust reserves to maintain price continuity
            _adjustReservesForCRRChange(expert, oldTier, newTier);
            expertReserves[expert].crrTier = newTier;
            
            emit CRRTierUpdated(expert, oldTier, newTier);
        }
    }

    // Update CRR tier based on reputation changes
   
    
    // Maintain price continuity when CRR changes
    function _adjustReservesForCRRChange(address expert, uint256 oldTier, uint256 newTier) private {
        ExpertReserves storage reserves = expertReserves[expert];
        
        uint256 oldCRR = crrValues[oldTier];
        uint256 newCRR = crrValues[newTier];
        
        // Current price = reserves / (supply * oldCRR)
        uint256 currentPrice = (reserves.xrpReserves * MAX_RESERVE_RATIO) / (reserves.circulatingSupply * oldCRR);
        
        // Required reserves for same price with new CRR
        uint256 requiredReserves = (currentPrice * reserves.circulatingSupply * newCRR) / MAX_RESERVE_RATIO;
        
        if (requiredReserves < reserves.xrpReserves) {
            // CRR decreased (reputation improved), expert gets bonus
            uint256 expertBonus = reserves.xrpReserves - requiredReserves;
            reserves.xrpReserves = requiredReserves;
            
            // Send bonus to expert
            payable(expert).transfer(expertBonus);
        } else if (requiredReserves > reserves.xrpReserves) {
            // CRR increased (reputation declined), might need additional reserves [we will dilute or transfer Tokens owned by expert]
            // For now, just adjust - could require expert to add more reserves
            reserves.xrpReserves = requiredReserves;

        }
    }
    
    function getCurrentPrice(address expert) external view returns (uint256) {
        require(isExpertActive[expert], "Expert not active");
        
        ExpertReserves storage reserves = expertReserves[expert];
        uint256 crr = crrValues[reserves.crrTier];
        
        return (reserves.xrpReserves * MAX_RESERVE_RATIO) / (reserves.circulatingSupply * crr);
    }
    
    function getExpertReserveInfo(address expert) 
        external 
        view 
        returns (
            uint256 xrpReserves,
            uint256 circulatingSupply,
            uint256 protocolHoldings,
            uint256 currentPrice,
            uint256 crrTier
        ) 
    {
        ExpertReserves storage reserves = expertReserves[expert];
        uint256 crr = crrValues[reserves.crrTier];
        uint256 price = isExpertActive[expert] ? 
            (reserves.xrpReserves * 100 * 10**18) / (reserves.circulatingSupply * crr) : 0;
        
        return (
            reserves.xrpReserves,
            reserves.circulatingSupply,
            reserves.protocolHoldings,
            price,
            reserves.crrTier
        );
    }
    // Protocol buying pressure mechanism
    function protocolBuyTokens(address expert, uint256 xrpAmount) external onlyAxonCore returns (uint256) {
        require(isExpertActive[expert], "Expert not active");
        require(address(this).balance >= xrpAmount, "Insufficient protocol balance");
        
        // Buy tokens using internal balance (from treasury)
        ExpertReserves storage reserves = expertReserves[expert];
        uint256 crr = crrValues[reserves.crrTier];
        
        uint256 tokensOut = (reserves.circulatingSupply * xrpAmount) / (reserves.xrpReserves * crr / 100);
        
        // Update reserves and protocol holdings
        reserves.xrpReserves += xrpAmount;
        reserves.circulatingSupply += tokensOut;
        reserves.protocolHoldings += tokensOut;
        
        // Mint tokens to protocol (held in this contract)
       //address expertToken = _getExpertToken(expert);
       // IExpertToken(expertToken).mint(address(this), tokensOut);
       // protocolSellableTokens[expert] += tokensOut;
        
        emit TokensPurchased(expert, address(this), xrpAmount, tokensOut);
        return tokensOut;
    }
    
    // OFF-CURVE SELLING: Protocol can sell tokens outside bonding curve
    function protocolSellOffCurve(
        address expert,
        address buyer,
        uint256 tokenAmount,
        uint256 pricePerToken
    ) external onlyAxonCore nonReentrant {
        //require(protocolSellableTokens[expert] >= tokenAmount, "Insufficient protocol tokens");
        require(buyer != address(0), "Invalid buyer");
        
        uint256 totalPrice = tokenAmount * pricePerToken;
        require(buyer.balance >= totalPrice, "Buyer insufficient balance");
        
        // Transfer tokens directly to buyer (OFF-CURVE)
        // address expertToken = _getExpertToken(expert);
        // IExpertToken(expertToken).transfer(buyer, tokenAmount);
        
        // Update protocol holdings
       // protocolSellableTokens[expert] -= tokenAmount;
        expertReserves[expert].protocolHoldings -= tokenAmount;
        
        // NOTE: This does NOT affect bonding curve reserves or circulating supply
        // This is pure OTC transaction between protocol and buyer
        
        emit ProtocolSoldOffCurve(expert, buyer, tokenAmount, pricePerToken);
    }
    
    // ON-CURVE SELLING: Protocol sells through bonding curve (affects price)
    function protocolSellOnCurve(address expert, uint256 tokenAmount) external onlyAxonCore returns (uint256) {
       // require(protocolSellableTokens[expert] >= tokenAmount, "Insufficient protocol tokens");
        
        ExpertReserves storage reserves = expertReserves[expert];
        uint256 crr = crrValues[reserves.crrTier];
        
        // Calculate XRP out using bonding curve
        uint256 xrpOut = (tokenAmount * reserves.xrpReserves * crr / 100) / reserves.circulatingSupply;
        
        // Burn protocol's tokens and reduce reserves
        // address expertToken = _getExpertToken(expert);
        // IExpertToken(expertToken).burn(tokenAmount);
        
        reserves.xrpReserves -= xrpOut;
        reserves.circulatingSupply -= tokenAmount;
        reserves.protocolHoldings -= tokenAmount;
       // protocolSellableTokens[expert] -= tokenAmount;
        
        emit TokensSold(expert, address(this), tokenAmount, xrpOut);
        return xrpOut;
    }
    


    
    
   
   

    receive() external payable {
        // Accept XRP for protocol operations
    }
}