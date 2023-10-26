/** @type import('hardhat/config').HardhatUserConfig */

import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/types";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// module.exports = {
//     solidity: "0.8.20",
//     network: {},
//     namedAccounts: {
//         deployer: {
//             default: 0,
//         },
//         player: {
//             default: 1,
//         },
//     },
// };

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: "0.8.18",
    networks: {
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
};

export default config;
