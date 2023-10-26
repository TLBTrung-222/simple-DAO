import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
} from "../hepler-hardhat-config";
import { ethers } from "hardhat";

const deployGovernorContract: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { deploy, log, get } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    // get the token and timelock contracts to put it in governor constructor
    const governanceToken = await get("GovernanceToken");
    const timeLock = await get("TimeLock");

    const governor = await deploy("GovernorContract", {
        from: deployer,
        args: [
            governanceToken.address,
            timeLock.address,
            QUORUM_PERCENTAGE,
            VOTING_PERIOD,
            VOTING_DELAY,
        ],
        log: true,
    });
    console.log(ethers.constants.AddressZero);
};

export default deployGovernorContract;
