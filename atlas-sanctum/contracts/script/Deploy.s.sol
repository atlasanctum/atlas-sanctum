// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/CovenantRegistry.sol";
import "../src/ReserveVault.sol";
import "../src/PayoutRouter.sol";
import "../src/ImpactVerifier.sol";

/**
 * @title Deploy
 * @notice Deployment script for Atlas Sanctum contracts
 */
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy CovenantRegistry
        CovenantRegistry covenantRegistry = new CovenantRegistry();
        console.log("CovenantRegistry deployed at:", address(covenantRegistry));

        // Deploy ReserveVault
        ReserveVault reserveVault = new ReserveVault(address(covenantRegistry));
        console.log("ReserveVault deployed at:", address(reserveVault));

        // Deploy PayoutRouter
        PayoutRouter payoutRouter = new PayoutRouter(
            address(covenantRegistry),
            address(reserveVault)
        );
        console.log("PayoutRouter deployed at:", address(payoutRouter));

        // Deploy ImpactVerifier
        ImpactVerifier impactVerifier = new ImpactVerifier();
        console.log("ImpactVerifier deployed at:", address(impactVerifier));

        // Authorize PayoutRouter in ReserveVault
        reserveVault.authorizeOperator(address(payoutRouter));
        console.log("PayoutRouter authorized in ReserveVault");

        vm.stopBroadcast();
    }
}
