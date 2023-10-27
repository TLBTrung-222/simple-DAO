import { network } from "hardhat";

export async function moveBlocks(numOfBlocks: number) {
    for (let i = 0; i < numOfBlocks; i++) {
        await network.provider.send("evm_mine", []);
    }
}
