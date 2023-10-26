import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MIN_DELAY } from "../hepler-hardhat-config";

const deployTimeLock: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { deploy, log } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], [], deployer], // leave the list of proposals and executors blank for now
        log: true,
    });
};

export default deployTimeLock;
