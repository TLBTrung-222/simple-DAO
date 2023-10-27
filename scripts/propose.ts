import { ethers, network } from "hardhat";
import { developmentChains, VOTING_DELAY } from "../hepler-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import fs from "fs";

//* we want to store a value to Box contract, so we creating a proposal
export async function propose(
    functionToCall: string,
    params: any[],
    proposalDescription: string
) {
    // get Governor and Box contracts
    const governorContract = await ethers.getContract("GovernorContract");
    const boxContract = await ethers.getContract("Box");
    // call propose function
    // syntax: propose(address[] targets, uint256[] values, bytes[] calldatas, string description) → uint256 proposalId
    // calldatas get by encoding function name with params (different with function signature)

    // Encode the data for a function call (e.g. tx.data)
    const encodedFunctionData = boxContract.interface.encodeFunctionData(
        functionToCall,
        params
    );

    console.log(
        `Proposing function "${functionToCall}" on contract ${boxContract.address.slice(
            0,
            5
        )}... with params: ${params}`
    );

    console.log(`Proposal description: ${proposalDescription}`);

    const proposeTx = await governorContract.propose(
        [boxContract.address],
        [0],
        [encodedFunctionData],
        proposalDescription
    );
    const proposeReceipt = await proposeTx.wait(1);

    // after creating proposal, there will be a time delay. In local network, there will be no one
    // to mint new block, so we need to speed up ourself

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1);
    }

    // after a proposal has been submitted, we can get information base on the emitted event
    const proposalId = proposeReceipt.events[0].args.proposalId; // we need proposal ID to vote (later)
    console.log(`Proposed with proposal ID:\n  ${proposalId}`);

    // save the proposalId to a file, so we can get it later
    storeProposalId(proposalId);
    // let proposalIdsBuffer = fs.readFileSync("../proposals.json");
}

function storeProposalId(proposalId: any) {
    const chainId: any = network.config.chainId;
    let listOfProposals = JSON.parse(
        fs.readFileSync("./proposals.json", "utf8")
    );
    console.log(listOfProposals);
    // if the chain not exist, add new chain with proposalId
    if (!listOfProposals[chainId]) {
        listOfProposals[chainId] = [proposalId.toString()];
    } else {
    }
    // write back to file
    fs.writeFileSync("./proposals.json", JSON.stringify(listOfProposals));
}

propose("store", [77], "Store 77 to the Box contract")
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
