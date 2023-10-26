import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// deploy box contract and transfer the ownership to timelock
const deployBox: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { deploy, log } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
    });

    // now, the deployer is owner of Box contract, we want to give TimeLock the ownership
    console.log("Transfer the Box's ownership to TimeLock contract...");
    const boxContract = await ethers.getContract("Box");
    const timeLockContract = await ethers.getContract("TimeLock");

    const transferOwnerTx = await boxContract.transferOwnership(
        timeLockContract.address
    );
    await transferOwnerTx.wait(1);
    // Now the Box only can be updated through a governance process
};

export default deployBox;
