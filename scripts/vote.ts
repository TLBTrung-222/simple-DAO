import { ethers, network } from "hardhat";
import fs from "fs";
import { moveTime } from "../utils/move-time";
import { VOTING_PERIOD, developmentChains } from "../hepler-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;

async function vote(proposalIndex: number) {
    const governorContract = await ethers.getContract("GovernorContract");
    const proposalIds: any = JSON.parse(
        fs.readFileSync("./proposals.json", "utf-8")
    );
    const chainId = network.config.chainId;

    // 0 = Against, 1 = For, 2 = Abstain for this example
    const voteWay = 1;

    const voteTx = await governorContract.castVote(
        proposalIds[chainId!][proposalIndex],
        voteWay
    );

    await voteTx.wait(1);

    // status of the proposal should be active (check enum ProposalState from IGovernor)
    const proposalState = await governorContract.state(
        proposalIds[chainId!][proposalIndex]
    );
    console.log(`Current Proposal State: ${proposalState}`);

    // move through voting period
    console.log("Moving through voting period time...");
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1);
    }
    // now the state will be 4 -> successed
    const latestProposalState = await governorContract.state(
        proposalIds[chainId!][proposalIndex]
    );
    console.log(
        `Status of the proposal: ${latestProposalState} (4 mean it's successed)`
    );
}

vote(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
