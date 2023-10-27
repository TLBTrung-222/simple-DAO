// because our DAO using TimeLock, there will be a queue phase before excuting

import { ethers, network } from "hardhat";
import { developmentChains, MIN_DELAY } from "../hepler-hardhat-config";
import { moveTime } from "../utils/move-time";
import { moveBlocks } from "../utils/move-blocks";

async function queueAndExcute(
    functionToCall: string,
    params: any[],
    proposalDescription: string
) {
    // gather neccesary information

    // get Governor and Box contracts
    const governorContract = await ethers.getContract("GovernorContract");
    const boxContract = await ethers.getContract("Box");

    //* Encode the data for a function call (e.g. tx.data)
    const encodedFunctionData = boxContract.interface.encodeFunctionData(
        functionToCall,
        params
    );
    // save gas because queue and excute function only look for hash of description
    const descriptionHash = ethers.utils.id(proposalDescription);

    //* Queuing
    console.log("Voting time pass, queuing the proposal...");
    const queueTx = await governorContract.queue(
        [boxContract.address],
        [0],
        [encodedFunctionData],
        descriptionHash
    );
    await queueTx.wait(1);

    // speed time up
    if (developmentChains.includes(network.name)) {
        moveTime(MIN_DELAY + 1);
        moveBlocks(1);
    }

    //* Execute
    console.log("Queing time passed, executing the proposal...");
    const executeTx = await governorContract.execute(
        [boxContract.address],
        [0],
        [encodedFunctionData],
        descriptionHash
    );
    await executeTx.wait(1);

    const boxNewValue = await boxContract.retrieve();
    console.log(`New value of Box: ${boxNewValue.toString()}`);
}

queueAndExcute("store", [77], "Store 77 to the Box contract")
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
