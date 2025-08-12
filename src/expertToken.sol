//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
pragma solidity ^0.8.0;


contract ExpertToken is ERC20{
    address public immutable expert;
    address public immutable axonCore;
    uint256 public constant MAX_SUPPLY = 100000000 * 10**18; // 100k tokens

    
    event PreActivationEarningAdded(uint256 amount);
    event TokenActivated(uint256 initialReserves);
    
    modifier onlyAxonCore() {
        require(msg.sender == axonCore, "Only Axon Core");
        _;
    }
    
    modifier onlyExpert() {
        require(msg.sender == expert, "Only expert");
        _;
    }
    
    constructor(
        address _expert,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        expert = _expert;
        axonCore = msg.sender;
        _mint(_expert, 100000); // Initial mint to expert
    }
    
    function mint(address to, uint256 amount) external onlyAxonCore {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function burn(uint256 amount, address _owner) external {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(_owner) >= amount, "Insufficient balance");
        _burn(_owner, amount);
    }
    
}
