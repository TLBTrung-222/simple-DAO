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
    const { deployer } = await hre.getNamedAccounts();

    const governorContract = await ethers.getContract("GovernorContract");
    const timeLock = await ethers.getContract("TimeLock");

    console.log("Setting up roles...");

    // get the bytes32 encoded role name
    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    // grant role to each contract
    const proposerTx = await timeLock.grantRole(
        proposerRole,
        governorContract.address
    );
    await proposerTx.wait(1);
    console.log(
        `Grant proposal role ${proposerRole} to contract ${governorContract.address}`
    );

    const executorTx = await timeLock.grantRole(
        executorRole,
        ethers.constants.AddressZero
    );
    await executorTx.wait(1);

    const revokeTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeTx.wait(1);
    console.log("Grant roles success!");
};

export default setupContracts;
