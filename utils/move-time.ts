import { network } from "hardhat";

export async function moveTime(timeToMove: number) {
    await network.provider.send("evm_increaseTime", [timeToMove]);
}
