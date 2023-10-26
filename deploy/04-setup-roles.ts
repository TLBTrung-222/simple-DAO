// To make it decentralized, we need to grant roles appropriately:
// proposer: Governor contract
// executor: every address
// admin: the owner of TimeLock is deployer, we will revoke it to make it decentralized

import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const setupContracts: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { deploy, log } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    const governorContract = await ethers.getContract("GovernanceToken");
    const timeLock = await ethers.getContract("TimeLock");

    console.log("Setting up roles...");

    // get the bytes32 encoded role name
    const proposerRole = await timeLock.PROPOSER_ROLE();
    const excecutorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    // grant role to each contract
    const grantProposerTx = await timeLock.grantRole(
        proposerRole,
        governorContract.address
    );
    await grantProposerTx.wait(1);

    const grantExecutorTx = await timeLock.grantRole(
        excecutorRole,
        ethers.constants.AddressZero
    );
    await grantExecutorTx.wait(1);

    const revokeAdminTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeAdminTx.wait(1);

    console.log("Grant roles success!");
};

export default setupContracts;
