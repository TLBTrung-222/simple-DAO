import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const governanceToken: DeployResult = await deploy("GovernanceToken", {
        from: deployer,
        log: true,
        args: [],
    });

    console.log(
        `Deployed governance token contract to address: ${governanceToken.address}`
    );

    await delegate(deployer);
};

// delegate all voting power to deployer (and update checkpoint for this account under the hood)
async function delegate(delegatee: string) {
    // Create contract instance to call delegate function
    const governanceToken = await ethers.getContract("GovernanceToken");

    const tx = await governanceToken.delegate(delegatee);
    await tx.wait(1);
    console.log(
        `Checkpoint ${await governanceToken.numCheckpoints(delegatee)}`
    );
}

export default deployGovernanceToken;
