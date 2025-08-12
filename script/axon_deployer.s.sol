// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";


import "../src/axon.sol";
import "../src/bountyfac.sol";
import "../src/expertRegistry.sol";
import "../src/reputationToken.sol";
import "../src/meritBondingCurve.sol";
import "../src/appeal.sol";



contract AxonDeployScript is Script {

    
    struct DeploymentInfo {
        address axonCore;
        address bountyFactory;
        address expertRegistry;
        address reputationNFT;
        address liquidityPool;
        address timelock;
        address governanceToken;
        address protocolTreasury;
    }

    function run() external returns (DeploymentInfo memory info) {
        
      
        vm.startBroadcast();

      
        ReputationNFT reputationNFT = new ReputationNFT();
        ExpertRegistry expertRegistry = new ExpertRegistry(address(reputationNFT));
        BountyFactory bountyFactory = new BountyFactory();
        BancorBondingCurve mcp = new BancorBondingCurve();
        AxonTimelock timelock = new AxonTimelock();
        AxonGovernanceToken governanceToken = new AxonGovernanceToken();
        
        // Use a local variable for the treasury
        address protocolTreasury = msg.sender;
        
        // Deploy the main protocol contract
        AxonCore axonCore = new AxonCore(
            address(bountyFactory),
            address(expertRegistry),
            address(reputationNFT),
            address(liquidityPool),
            protocolTreasury
        );

        // --- 2. Set up permissions ---
        
        // The script uses the deployed contract instances to call their functions.
        reputationNFT.setAxonCore(address(axonCore));
        expertRegistry.setAxonCore(address(axonCore));
        bountyFactory.setAxonCore(address(axonCore));
        
        // --- 3. Transfer ownership ---
        
        reputationNFT.transferOwnership(msg.sender);
        expertRegistry.transferOwnership(msg.sender);
        bountyFactory.transferOwnership(msg.sender);
        axonCore.transferOwnership(msg.sender);
        timelock.transferOwnership(msg.sender);
        
        // This tells Foundry to stop recording transactions and prepare for broadcasting.
        vm.stopBroadcast();
        
        // --- 4. Store and log the deployed addresses ---
        
        info = DeploymentInfo({
            axonCore: address(axonCore),
            bountyFactory: address(bountyFactory),
            expertRegistry: address(expertRegistry),
            reputationNFT: address(reputationNFT),
            liquidityPool: address(liquidityPool),
            timelock: address(timelock),
            governanceToken: address(governanceToken),
            protocolTreasury: protocolTreasury
        });
        
        // Use console.log to print the addresses. These will appear in your terminal.
        console.log("-----------------------------------------");
        console.log("Axon Protocol Deployment Successful!");
        console.log("-----------------------------------------");
        console.log("AxonCore address:         ", info.axonCore);
        console.log("BountyFactory address:    ", info.bountyFactory);
        console.log("ExpertRegistry address:   ", info.expertRegistry);
        console.log("ReputationNFT address:    ", info.reputationNFT);
        console.log("MCP address:    ", info.liquidityPool);
        console.log("Timelock address:         ", info.timelock);
        console.log("ProtocolTreasury address: ", info.protocolTreasury);
    }
}

